import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    // Check environment variables
    const mongoUri = process.env.MONGODB_URI;
    const mongoDb = process.env.MONGODB_DB;

    console.log('Environment check:', {
      hasMongoUri: !!mongoUri,
      hasMongoDb: !!mongoDb,
      nodeEnv: process.env.NODE_ENV,
      mongoUriLength: mongoUri?.length || 0,
      mongoDbValue: mongoDb
    });

    // Return detailed environment info for debugging
    const envInfo = {
      hasMongoUri: !!mongoUri,
      hasMongoDb: !!mongoDb,
      nodeEnv: process.env.NODE_ENV,
      mongoUriLength: mongoUri?.length || 0,
      mongoDbValue: mongoDb,
      mongoUriStart: mongoUri?.substring(0, 20) + '...' || 'undefined'
    };

    if (!mongoUri) {
      return NextResponse.json({
        success: false,
        error: 'MONGODB_URI environment variable is missing',
        envInfo
      }, { status: 500 });
    }

    if (!mongoDb) {
      return NextResponse.json({
        success: false,
        error: 'MONGODB_DB environment variable is missing',
        envInfo
      }, { status: 500 });
    }

    // Test MongoDB connection using improved connection method
    const db = await getDatabase();

    // Test database access
    const collections = await db.listCollections().toArray();

    // Get sample transaction count
    const transactionCount = collections.find(c => c.name === 'transactions')
      ? await db.collection('transactions').countDocuments()
      : 0;

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      envInfo,
      data: {
        dbName: mongoDb,
        collections: collections.map(c => c.name),
        collectionsCount: collections.length,
        transactionCount
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      envInfo: {
        hasMongoUri: !!process.env.MONGODB_URI,
        hasMongoDb: !!process.env.MONGODB_DB,
        nodeEnv: process.env.NODE_ENV
      }
    }, { status: 500 });
  }
}
