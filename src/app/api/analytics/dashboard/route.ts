import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/db-utils';

export async function GET() {
  try {
    const stats = await dbService.getDashboardStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
