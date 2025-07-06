import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/db-utils';

// Configure timeout for Vercel deployment
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    
    if (!month) {
      return NextResponse.json(
        { success: false, error: 'Month parameter is required' },
        { status: 400 }
      );
    }

    // Validate month format
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { success: false, error: 'Month must be in YYYY-MM format' },
        { status: 400 }
      );
    }

    const comparison = await dbService.getBudgetComparison(month);
    return NextResponse.json({ success: true, data: comparison });
  } catch (error) {
    console.error('Error fetching budget comparison:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch budget comparison' },
      { status: 500 }
    );
  }
}
