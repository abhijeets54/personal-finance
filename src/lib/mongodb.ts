import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'personal_finance';

// Connection options optimized for serverless environments
const options = {
  // Serverless functions are stateless, so we need minimal connections
  maxPoolSize: 1, // Maintain up to 1 socket connection in serverless environment
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 30000, // Close sockets after 30 seconds of inactivity
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
  minPoolSize: 0, // Minimum number of connections in the connection pool
  retryWrites: true,
  retryReads: true,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}

// Helper function to get client for connection management
export async function getClient(): Promise<MongoClient> {
  return await clientPromise;
}

// Helper function to close connection (useful for cleanup in some scenarios)
export async function closeConnection(): Promise<void> {
  try {
    const client = await clientPromise;
    await client.close();
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
}

// Connection warming function for cold start optimization
export async function warmConnection(): Promise<boolean> {
  try {
    const db = await getDatabase();
    // Perform a lightweight operation to warm the connection
    await db.admin().ping();
    console.log('MongoDB connection warmed successfully');
    return true;
  } catch (error) {
    console.error('Failed to warm MongoDB connection:', error);
    return false;
  }
}

// Pre-warm connection on module load in production
if (process.env.NODE_ENV === 'production') {
  // Don't await this to avoid blocking module loading
  warmConnection().catch(console.error);
}

export default clientPromise;
