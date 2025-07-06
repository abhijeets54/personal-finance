import { getDatabase } from './mongodb';

/**
 * Database indexing recommendations for optimal performance
 * 
 * These indexes should be created in MongoDB Atlas or your MongoDB instance
 * for optimal query performance, especially in serverless environments.
 */

export const RECOMMENDED_INDEXES = {
  transactions: [
    // Compound index for date-based queries with sorting
    { date: -1, createdAt: -1 },
    
    // Index for type-based filtering (income/expense)
    { type: 1 },
    
    // Compound index for category analysis
    { type: 1, category: 1 },
    
    // Compound index for date range queries
    { type: 1, date: 1 },
    
    // Index for amount-based queries
    { amount: 1 },
    
    // Compound index for dashboard queries
    { type: 1, date: -1, amount: 1 }
  ],
  
  budgets: [
    // Compound index for budget queries
    { category: 1, month: 1 },
    
    // Index for month-based queries
    { month: 1 },
    
    // Index for category-based queries
    { category: 1 }
  ]
};

/**
 * Function to create recommended indexes
 * This should be run during application setup or deployment
 */
export async function createRecommendedIndexes(): Promise<void> {
  try {
    const db = await getDatabase();
    
    // Create indexes for transactions collection
    const transactionsCollection = db.collection('transactions');
    for (const index of RECOMMENDED_INDEXES.transactions) {
      await transactionsCollection.createIndex(index as any, { background: true });
      console.log('Created index for transactions:', index);
    }

    // Create indexes for budgets collection
    const budgetsCollection = db.collection('budgets');
    for (const index of RECOMMENDED_INDEXES.budgets) {
      await budgetsCollection.createIndex(index as any, { background: true });
      console.log('Created index for budgets:', index);
    }
    
    console.log('All recommended indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
    throw error;
  }
}

/**
 * Function to check if recommended indexes exist
 */
export async function checkIndexes(): Promise<{
  transactions: any[];
  budgets: any[];
}> {
  try {
    const db = await getDatabase();
    
    const transactionsIndexes = await db.collection('transactions').listIndexes().toArray();
    const budgetsIndexes = await db.collection('budgets').listIndexes().toArray();
    
    return {
      transactions: transactionsIndexes,
      budgets: budgetsIndexes
    };
  } catch (error) {
    console.error('Error checking indexes:', error);
    throw error;
  }
}

/**
 * Query optimization hints for common operations
 */
export const QUERY_HINTS = {
  // For dashboard stats - use compound index
  dashboardStats: { type: 1, date: -1, amount: 1 },
  
  // For recent transactions - use date index
  recentTransactions: { date: -1, createdAt: -1 },
  
  // For category analysis - use type + category index
  categoryAnalysis: { type: 1, category: 1 },
  
  // For monthly expenses - use type + date index
  monthlyExpenses: { type: 1, date: 1 },
  
  // For budget comparison - use category + month index
  budgetComparison: { category: 1, month: 1 }
};

/**
 * Performance monitoring for queries
 */
export function logQueryPerformance(operation: string, startTime: number): void {
  const duration = Date.now() - startTime;
  
  if (duration > 1000) {
    console.warn(`Slow query detected: ${operation} took ${duration}ms`);
  } else {
    console.log(`Query performance: ${operation} took ${duration}ms`);
  }
}

/**
 * Wrapper function to add performance monitoring to database operations
 */
export function withPerformanceMonitoring<T extends any[], R>(
  operation: string,
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    const startTime = Date.now();
    try {
      const result = await fn(...args);
      logQueryPerformance(operation, startTime);
      return result;
    } catch (error) {
      logQueryPerformance(`${operation} (failed)`, startTime);
      throw error;
    }
  };
}
