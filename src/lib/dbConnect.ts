import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let cachedClient: mongoose.Mongoose | null = null;
let cachedDb: mongoose.Connection | null = null;

async function dbConnect() {
  if (cachedDb) {
    return cachedDb;
  }

  if (!cachedClient) {
    cachedClient = await mongoose.connect(MONGODB_URI);
  }

  cachedDb = cachedClient.connection;
  return cachedDb;
}

export default dbConnect;
