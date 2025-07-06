import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/db-utils';

// Configure timeout for Vercel deployment
export const maxDuration = 30;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const transaction = await dbService.getTransactionById(id);
    
    if (!transaction) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: transaction });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transaction' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { amount, date, description, category, type } = body;

    // Validate fields if provided
    const updates: Record<string, unknown> = {};

    if (amount !== undefined) {
      if (typeof amount !== 'number' || amount <= 0) {
        return NextResponse.json(
          { success: false, error: 'Amount must be a positive number' },
          { status: 400 }
        );
      }
      updates.amount = parseFloat(amount.toString());
    }

    if (date !== undefined) updates.date = date;
    if (description !== undefined) updates.description = description.trim();
    if (category !== undefined) updates.category = category;

    if (type !== undefined) {
      if (type !== 'income' && type !== 'expense') {
        return NextResponse.json(
          { success: false, error: 'Type must be either income or expense' },
          { status: 400 }
        );
      }
      updates.type = type;
    }

    const success = await dbService.updateTransaction(id, updates);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await dbService.deleteTransaction(id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
}
