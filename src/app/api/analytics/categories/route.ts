import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/db-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;

    const categories = await dbService.getCategorySummary(startDate, endDate);
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching category summary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category summary' },
      { status: 500 }
    );
  }
}
