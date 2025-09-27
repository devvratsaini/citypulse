import mongoose from 'mongoose';

// This is a type definition for the connection object to avoid TypeScript errors.
interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// We cache the connection so we don't have to reconnect on every request.
// In a serverless environment, this is crucial for performance.
let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
      );
    }

    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false, // Disables mongoose's buffering mechanism
    }).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;