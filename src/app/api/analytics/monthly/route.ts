import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db-utils';

export async function GET() {
  try {
    const monthlyData = await dbService.getMonthlyExpenses();
    return NextResponse.json({ success: true, data: monthlyData });
  } catch (error) {
    console.error('Error fetching monthly expenses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch monthly expenses' },
      { status: 500 }
    );
  }
}
