import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

const dbName = process.env.MONGODB_DB || 'personal_finance';

// Global is used here to maintain a cached connection across hot reloads
// in development and to prevent connections growing exponentially in production
let cached = global as typeof globalThis & {
  mongo?: {
    client: MongoClient;
    promise: Promise<MongoClient>;
    conn?: {
      client: MongoClient;
      db: Db;
    } | null;
  };
};

if (!cached.mongo) {
  cached.mongo = { 
    client: new MongoClient(uri, options),
    promise: null as unknown as Promise<MongoClient>
  };
  cached.mongo.promise = cached.mongo.client.connect();
}

const clientPromise = cached.mongo.promise;

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}

export default clientPromise;
