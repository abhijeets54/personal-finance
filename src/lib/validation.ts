import { TRANSACTION_CATEGORIES } from '@/types';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Transaction validation
export function validateTransaction(data: {
  amount?: string | number;
  date?: string;
  description?: string;
  category?: string;
  type?: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  // Amount validation
  if (!data.amount) {
    errors.push({ field: 'amount', message: 'Amount is required' });
  } else {
    const amount = typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount;
    if (isNaN(amount) || amount <= 0) {
      errors.push({ field: 'amount', message: 'Amount must be a positive number' });
    }
    if (amount > 1000000) {
      errors.push({ field: 'amount', message: 'Amount cannot exceed $1,000,000' });
    }
  }

  // Date validation
  if (!data.date) {
    errors.push({ field: 'date', message: 'Date is required' });
  } else {
    const date = new Date(data.date);
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    
    if (isNaN(date.getTime())) {
      errors.push({ field: 'date', message: 'Invalid date format' });
    } else if (date < oneYearAgo) {
      errors.push({ field: 'date', message: 'Date cannot be more than 1 year ago' });
    } else if (date > oneYearFromNow) {
      errors.push({ field: 'date', message: 'Date cannot be more than 1 year in the future' });
    }
  }

  // Description validation
  if (!data.description) {
    errors.push({ field: 'description', message: 'Description is required' });
  } else {
    const description = data.description.trim();
    if (description.length < 3) {
      errors.push({ field: 'description', message: 'Description must be at least 3 characters' });
    }
    if (description.length > 200) {
      errors.push({ field: 'description', message: 'Description cannot exceed 200 characters' });
    }
  }

  // Category validation
  if (!data.category) {
    errors.push({ field: 'category', message: 'Category is required' });
  } else if (!TRANSACTION_CATEGORIES.includes(data.category as any)) {
    errors.push({ field: 'category', message: 'Invalid category selected' });
  }

  // Type validation
  if (!data.type) {
    errors.push({ field: 'type', message: 'Transaction type is required' });
  } else if (data.type !== 'income' && data.type !== 'expense') {
    errors.push({ field: 'type', message: 'Type must be either income or expense' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
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
      
      if (year < currentYear - 1 || year > currentYear + 2) {
        errors.push({ field: 'month', message: 'Year must be within reasonable range' });
      }
      if (month < 1 || month > 12) {
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
  return date.toISOString().split('T')[0];
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
