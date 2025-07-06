import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'personal_finance';

// Connection options optimized for serverless environments
const options = {
  maxPoolSize: 1, // Maintain up to 1 socket connection in serverless environment
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 30000, // Close sockets after 30 seconds of inactivity
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  retryWrites: true,
  retryReads: true,
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
  minPoolSize: 0, // Minimum number of connections in the connection pool
};

// Global is used here to maintain a cached connection across hot reloads
// in development and to prevent connections growing exponentially in production
let cached = global as typeof globalThis & {
  mongo?: {
    conn: { client: MongoClient; db: Db } | null;
    promise: Promise<{ client: MongoClient; db: Db }> | null;
  };
};

if (!cached.mongo) {
  cached.mongo = { conn: null, promise: null };
}

async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cached.mongo!.conn) {
    return cached.mongo!.conn;
  }

  if (!cached.mongo!.promise) {
    const client = new MongoClient(uri, options);

    cached.mongo!.promise = client.connect().then((client) => {
      return {
        client,
        db: client.db(dbName),
      };
    });
  }

  try {
    cached.mongo!.conn = await cached.mongo!.promise;
  } catch (e) {
    cached.mongo!.promise = null;
    throw e;
  }

  return cached.mongo!.conn;
}

export async function getDatabase(): Promise<Db> {
  const { db } = await connectToDatabase();
  return db;
}

export async function getClient(): Promise<MongoClient> {
  const { client } = await connectToDatabase();
  return client;
}

// For backwards compatibility
const clientPromise = connectToDatabase().then(({ client }) => client);
export default clientPromise;
