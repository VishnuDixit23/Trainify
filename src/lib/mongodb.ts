import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI as string; // Ensure this is set in `.env.local`
const dbName = "workout-plan"; // Update this to match your database name

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Create a cached connection for reuse in development (Prevents multiple connections)
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (cachedDb) return cachedDb;

  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(dbName);
  cachedClient = client;
  cachedDb = db;

  return db;
}
