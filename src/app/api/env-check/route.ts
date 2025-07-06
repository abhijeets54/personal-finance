import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    environment: process.env.NODE_ENV,
    hasMongoUri: !!process.env.MONGODB_URI,
    mongoUriLength: process.env.MONGODB_URI?.length || 0,
    hasMongoDb: !!process.env.MONGODB_DB,
    mongoDbValue: process.env.MONGODB_DB
  });
} 