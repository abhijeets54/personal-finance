import { z } from 'zod';
import { TRANSACTION_CATEGORIES } from '@/types';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Zod validation schemas
export const TransactionSchema = z.object({
  amount: z.number().positive('Amount must be a positive number').max(1000000, 'Amount cannot exceed $1,000,000'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').refine((date) => {
    const d = new Date(date);
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    return d >= oneYearAgo && d <= oneYearFromNow;
  }, 'Date must be within one year of today'),
  description: z.string().min(3, 'Description must be at least 3 characters').max(200, 'Description cannot exceed 200 characters').transform(val => val.trim()),
  category: z.enum(TRANSACTION_CATEGORIES as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Invalid category selected' })
  }),
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: 'Type must be either income or expense' })
  })
});

export const BudgetSchema = z.object({
  category: z.enum(TRANSACTION_CATEGORIES as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Invalid category selected' })
  }),
  amount: z.number().positive('Budget amount must be a positive number').max(100000, 'Budget amount cannot exceed $100,000'),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format').refine((month) => {
    const [year, monthNum] = month.split('-').map(Number);
    const currentYear = new Date().getFullYear();
    return year && monthNum && year >= currentYear - 1 && year <= currentYear + 2 && monthNum >= 1 && monthNum <= 12;
  }, 'Month must be within reasonable range')
});

// Query parameter validation schemas
export const TransactionQuerySchema = z.object({
  limit: z.union([z.string(), z.undefined()]).optional().transform((val) => {
    if (!val) return 20;
    const num = parseInt(val);
    if (isNaN(num) || num < 1 || num > 100) {
      throw new Error('Limit must be between 1 and 100');
    }
    return num;
  })
});

export const BudgetComparisonQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format')
});

// Type exports for TypeScript
export type TransactionInput = z.infer<typeof TransactionSchema>;
export type BudgetInput = z.infer<typeof BudgetSchema>;
export type TransactionQuery = z.infer<typeof TransactionQuerySchema>;
export type BudgetComparisonQuery = z.infer<typeof BudgetComparisonQuerySchema>;

// Validation helper function
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Validation failed: ${messages.join(', ')}`);
    }
    throw error;
  }
}

// Legacy validation function for backward compatibility
export function validateTransaction(data: {
  amount?: string | number;
  date?: string;
  description?: string;
  category?: string;
  type?: string;
}): ValidationResult {
  try {
    const normalizedData = {
      ...data,
      amount: typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount
    };
    TransactionSchema.parse(normalizedData);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return { isValid: false, errors };
    }
    return { isValid: false, errors: [{ field: 'general', message: 'Validation failed' }] };
  }
}

// Budget validation
export function validateBudget(data: {
  category?: string;
  amount?: string | number;
  month?: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  // Category validation
  if (!data.category) {
    errors.push({ field: 'category', message: 'Category is required' });
  } else if (!TRANSACTION_CATEGORIES.includes(data.category as any)) {
    errors.push({ field: 'category', message: 'Invalid category selected' });
  }

  // Amount validation
  if (!data.amount) {
    errors.push({ field: 'amount', message: 'Budget amount is required' });
  } else {
    const amount = typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount;
    if (isNaN(amount) || amount <= 0) {
      errors.push({ field: 'amount', message: 'Budget amount must be a positive number' });
    }
    if (amount > 100000) {
      errors.push({ field: 'amount', message: 'Budget amount cannot exceed $100,000' });
    }
  }

  // Month validation
  if (!data.month) {
    errors.push({ field: 'month', message: 'Month is required' });
  } else {
    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(data.month)) {
      errors.push({ field: 'month', message: 'Month must be in YYYY-MM format' });
    } else {
      const [year, month] = data.month.split('-').map(Number);
      const currentYear = new Date().getFullYear();

      if (year && (year < currentYear - 1 || year > currentYear + 2)) {
        errors.push({ field: 'month', message: 'Year must be within reasonable range' });
      }
      if (month && (month < 1 || month > 12)) {
        errors.push({ field: 'month', message: 'Invalid month' });
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Generic form validation helper
export function getFieldError(errors: ValidationError[], fieldName: string): string | undefined {
  const error = errors.find(err => err.field === fieldName);
  return error?.message;
}

// Sanitize input
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

// Format currency for display
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

// Parse currency input
export function parseCurrency(input: string): number {
  const cleaned = input.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

// Date formatting utilities
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0] || '';
}

// API error handling
export function handleApiError(error: any): string {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
