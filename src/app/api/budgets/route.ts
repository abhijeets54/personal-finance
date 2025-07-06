import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/db-utils';

// Configure timeout for Vercel deployment
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') || undefined;

    const budgets = await dbService.getBudgets(month);
    return NextResponse.json({ success: true, data: budgets });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch budgets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, amount, month } = body;
    
    if (!category || !amount || !month) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    // Validate month format (YYYY-MM)
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { success: false, error: 'Month must be in YYYY-MM format' },
        { status: 400 }
      );
    }

    const id = await dbService.createOrUpdateBudget({
      category,
      amount: parseFloat(amount.toString()),
      month
    });

    return NextResponse.json({ success: true, data: { id } }, { status: 201 });
  } catch (error) {
    console.error('Error creating/updating budget:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create/update budget' },
      { status: 500 }
    );
  }
}
