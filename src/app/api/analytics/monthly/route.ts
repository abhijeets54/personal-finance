import { NextResponse } from 'next/server';

export async function GET() {
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

    // Get monthly expenses data
    const pipeline = [
      {
        $match: {
          type: 'expense'
        }
      },
      {
        $addFields: {
          dateObj: { $dateFromString: { dateString: "$date" } }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$dateObj" },
            month: { $month: "$dateObj" }
          },
          amount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      },
      {
        $project: {
          month: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              { $cond: [
                { $lt: ["$_id.month", 10] },
                { $concat: ["0", { $toString: "$_id.month" }] },
                { $toString: "$_id.month" }
              ]}
            ]
          },
          amount: 1,
          count: 1,
          _id: 0
        }
      }
    ];

    const monthlyData = await collection.aggregate(pipeline).toArray();
    await client.close();

    return NextResponse.json({ success: true, data: monthlyData });
  } catch (error) {
    console.error('Error fetching monthly expenses:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch monthly expenses',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
