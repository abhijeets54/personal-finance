import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

// Configure timeout for Vercel deployment
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;

    const db = await getDatabase();
    const collection = db.collection('transactions');

    const transactions = await collection
      .find({})
      .sort({ date: -1, createdAt: -1 })
      .limit(limit)
      .toArray();

    // Convert ObjectId to string
    const formattedTransactions = transactions.map(t => ({
      ...t,
      _id: t._id.toString()
    }));

    return NextResponse.json({ success: true, data: formattedTransactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { amount, date, description, category, type } = body;

    if (!amount || !date || !description || !category || !type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (type !== 'income' && type !== 'expense') {
      return NextResponse.json(
        { success: false, error: 'Type must be either income or expense' },
        { status: 400 }
      );
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection('transactions');

    const now = new Date();
    const transaction = {
      amount: parseFloat(amount.toString()),
      date,
      description: description.trim(),
      category,
      type,
      createdAt: now,
      updatedAt: now
    };

    const result = await collection.insertOne(transaction);

    return NextResponse.json({
      success: true,
      data: { id: result.insertedId.toString() }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
