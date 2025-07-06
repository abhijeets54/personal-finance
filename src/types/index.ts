export interface Transaction {
  _id?: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Budget {
  _id?: string;
  category: string;
  amount: number;
  month: string; // Format: YYYY-MM
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategorySummary {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface MonthlyExpense {
  month: string;
  amount: number;
  count: number;
}

export interface BudgetComparison {
  category: string;
  budgeted: number;
  actual: number;
  remaining: number;
  percentage: number;
}

export interface DashboardStats {
  totalExpenses: number;
  totalIncome: number;
  netAmount: number;
  transactionCount: number;
  topCategories: CategorySummary[];
  recentTransactions: Transaction[];
}

export const TRANSACTION_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Groceries',
  'Gas',
  'Insurance',
  'Investment',
  'Salary',
  'Freelance',
  'Business',
  'Other'
] as const;

export type TransactionCategory = typeof TRANSACTION_CATEGORIES[number];
