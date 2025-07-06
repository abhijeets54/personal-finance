import { getDatabase } from './mongodb';
import { Transaction, Budget, CategorySummary, MonthlyExpense, BudgetComparison, DashboardStats } from '@/types';
import { ObjectId } from 'mongodb';

// MongoDB document types (with ObjectId)
interface TransactionDocument extends Omit<Transaction, '_id'> {
  _id?: ObjectId;
}

interface BudgetDocument extends Omit<Budget, '_id'> {
  _id?: ObjectId;
}

export class DatabaseService {
  private async getTransactionsCollection() {
    const db = await getDatabase();
    return db.collection<TransactionDocument>('transactions');
  }

  private async getBudgetsCollection() {
    const db = await getDatabase();
    return db.collection<BudgetDocument>('budgets');
  }

  // Transaction operations
  async createTransaction(transaction: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>) {
    const collection = await this.getTransactionsCollection();
    const now = new Date();
    const result = await collection.insertOne({
      ...transaction,
      createdAt: now,
      updatedAt: now,
    });
    return result.insertedId.toString();
  }

  async getTransactions(limit?: number, skip?: number) {
    const collection = await this.getTransactionsCollection();
    const cursor = collection.find({}).sort({ date: -1, createdAt: -1 });
    
    if (skip) cursor.skip(skip);
    if (limit) cursor.limit(limit);
    
    const transactions = await cursor.toArray();
    return transactions.map(t => ({ ...t, _id: t._id?.toString() }));
  }

  async getTransactionById(id: string) {
    const collection = await this.getTransactionsCollection();
    const transaction = await collection.findOne({ _id: new ObjectId(id) });
    return transaction ? { ...transaction, _id: transaction._id.toString() } : null;
  }

  async updateTransaction(id: string, updates: Partial<Transaction>) {
    const collection = await this.getTransactionsCollection();
    // Create update object without _id
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...updateFields } = updates;
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateFields, updatedAt: new Date() } as Partial<TransactionDocument> }
    );
    return result.modifiedCount > 0;
  }

  async deleteTransaction(id: string) {
    const collection = await this.getTransactionsCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  // Budget operations
  async createOrUpdateBudget(budget: Omit<Budget, '_id' | 'createdAt' | 'updatedAt'>) {
    const collection = await this.getBudgetsCollection();
    const now = new Date();
    
    const existing = await collection.findOne({
      category: budget.category,
      month: budget.month
    });

    if (existing) {
      await collection.updateOne(
        { _id: existing._id },
        { $set: { amount: budget.amount, updatedAt: now } }
      );
      return existing._id.toString();
    } else {
      const result = await collection.insertOne({
        ...budget,
        createdAt: now,
        updatedAt: now,
      });
      return result.insertedId.toString();
    }
  }

  async getBudgets(month?: string) {
    const collection = await this.getBudgetsCollection();
    const query = month ? { month } : {};
    const budgets = await collection.find(query).toArray();
    return budgets.map(b => ({ ...b, _id: b._id?.toString() }));
  }

  // Analytics operations
  async getCategorySummary(startDate?: string, endDate?: string): Promise<CategorySummary[]> {
    const collection = await this.getTransactionsCollection();
    const matchStage: { type: string; date?: { $gte?: string; $lte?: string } } = { type: 'expense' };
    
    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = startDate;
      if (endDate) matchStage.date.$lte = endDate;
    }

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { amount: -1 } }
    ];

    const results = await collection.aggregate(pipeline).toArray();
    const total = results.reduce((sum, item) => sum + item.amount, 0);
    
    return results.map(item => ({
      category: item._id,
      amount: item.amount,
      count: item.count,
      percentage: total > 0 ? (item.amount / total) * 100 : 0
    }));
  }

  async getMonthlyExpenses(): Promise<MonthlyExpense[]> {
    const collection = await this.getTransactionsCollection();
    
    const pipeline = [
      { $match: { type: 'expense' } },
      {
        $group: {
          _id: { $substr: ['$date', 0, 7] }, // Extract YYYY-MM
          amount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ];

    const results = await collection.aggregate(pipeline).toArray();
    return results.map(item => ({
      month: item._id,
      amount: item.amount,
      count: item.count
    }));
  }

  async getBudgetComparison(month: string): Promise<BudgetComparison[]> {
    const budgets = await this.getBudgets(month);
    const startDate = `${month}-01`;
    const endDate = `${month}-31`;
    
    const collection = await this.getTransactionsCollection();
    const actualSpending = await collection.aggregate([
      {
        $match: {
          type: 'expense',
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$category',
          actual: { $sum: '$amount' }
        }
      }
    ]).toArray();

    const actualMap = new Map(actualSpending.map(item => [item._id, item.actual]));
    
    return budgets.map(budget => {
      const actual = actualMap.get(budget.category) || 0;
      const remaining = budget.amount - actual;
      const percentage = budget.amount > 0 ? (actual / budget.amount) * 100 : 0;
      
      return {
        category: budget.category,
        budgeted: budget.amount,
        actual,
        remaining,
        percentage
      };
    });
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const collection = await this.getTransactionsCollection();
    

    // Get totals
    const [expenseResult, incomeResult] = await Promise.all([
      collection.aggregate([
        { $match: { type: 'expense' } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]).toArray(),
      collection.aggregate([
        { $match: { type: 'income' } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]).toArray()
    ]);

    const totalExpenses = expenseResult[0]?.total || 0;
    const totalIncome = incomeResult[0]?.total || 0;
    const transactionCount = (expenseResult[0]?.count || 0) + (incomeResult[0]?.count || 0);

    // Get top categories and recent transactions
    const [topCategories, recentTransactions] = await Promise.all([
      this.getCategorySummary(),
      this.getTransactions(5)
    ]);

    return {
      totalExpenses,
      totalIncome,
      netAmount: totalIncome - totalExpenses,
      transactionCount,
      topCategories: topCategories.slice(0, 5),
      recentTransactions
    };
  }
}

export const dbService = new DatabaseService();
