import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const mongoUri = process.env.MONGODB_URI;
    const mongoDb = process.env.MONGODB_DB;
    
    console.log('Environment check:', {
      hasMongoUri: !!mongoUri,
      hasMongoDb: !!mongoDb,
      nodeEnv: process.env.NODE_ENV
    });

    if (!mongoUri) {
      return NextResponse.json({
        success: false,
        error: 'MONGODB_URI environment variable is missing'
      }, { status: 500 });
    }

    if (!mongoDb) {
      return NextResponse.json({
        success: false,
        error: 'MONGODB_DB environment variable is missing'
      }, { status: 500 });
    }

    // Test MongoDB connection
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(mongoUri);
    
    await client.connect();
    const db = client.db(mongoDb);
    
    // Test database access
    const collections = await db.listCollections().toArray();
    
    await client.close();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        dbName: mongoDb,
        collections: collections.map(c => c.name),
        collectionsCount: collections.length
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
