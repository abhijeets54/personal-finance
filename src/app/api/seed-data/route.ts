import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const { MongoClient } = await import('mongodb');
    const mongoUri = process.env.MONGODB_URI;
    const mongoDb = process.env.MONGODB_DB;

    if (!mongoUri || !mongoDb) {
      return NextResponse.json(
        { success: false, error: 'Database configuration missing' },
        { status: 500 }
      );
    }

    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db(mongoDb);
    const collection = db.collection('transactions');

    // Check if data already exists
    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      await client.close();
      return NextResponse.json({
        success: true,
        message: 'Data already exists',
        count: existingCount
      });
    }

    // Sample transactions for demonstration
    const sampleTransactions = [
      {
        amount: 5000,
        date: '2024-01-15',
        description: 'Salary',
        category: 'Salary',
        type: 'income',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        amount: 1200,
        date: '2024-01-16',
        description: 'Grocery shopping',
        category: 'Food & Dining',
        type: 'expense',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        amount: 800,
        date: '2024-01-17',
        description: 'Electricity bill',
        category: 'Utilities',
        type: 'expense',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        amount: 2000,
        date: '2024-01-18',
        description: 'Freelance work',
        category: 'Freelance',
        type: 'income',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        amount: 1500,
        date: '2024-01-20',
        description: 'Shopping',
        category: 'Shopping',
        type: 'expense',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        amount: 600,
        date: '2024-01-22',
        description: 'Fuel',
        category: 'Transportation',
        type: 'expense',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        amount: 3000,
        date: '2024-02-01',
        description: 'Bonus',
        category: 'Salary',
        type: 'income',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        amount: 900,
        date: '2024-02-03',
        description: 'Restaurant',
        category: 'Food & Dining',
        type: 'expense',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        amount: 1200,
        date: '2024-02-05',
        description: 'Internet bill',
        category: 'Utilities',
        type: 'expense',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        amount: 2500,
        date: '2024-02-10',
        description: 'Rent',
        category: 'Housing',
        type: 'expense',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const result = await collection.insertMany(sampleTransactions);
    await client.close();

    return NextResponse.json({
      success: true,
      message: 'Sample data inserted successfully',
      insertedCount: result.insertedCount,
      insertedIds: Object.values(result.insertedIds).map(id => id.toString())
    });

  } catch (error) {
    console.error('Error seeding data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
