import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection('transactions');

    // Get category summary for expenses only
    const pipeline = [
      {
        $match: {
          type: 'expense'
        }
      },
      {
        $group: {
          _id: "$category",
          amount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: "$_id",
          amount: 1,
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { amount: -1 }
      }
    ];

    const categoryData = await collection.aggregate(pipeline).toArray();

    // Calculate percentages
    const totalAmount = categoryData.reduce((sum, cat) => sum + cat.amount, 0);
    const categoriesWithPercentage = categoryData.map(cat => ({
      ...cat,
      percentage: totalAmount > 0 ? (cat.amount / totalAmount) * 100 : 0
    }));

    return NextResponse.json({ success: true, data: categoriesWithPercentage });
  } catch (error) {
    console.error('Error fetching category summary:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch category summary',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
