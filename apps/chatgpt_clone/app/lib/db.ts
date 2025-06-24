// lib/db.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
console.log('🔗 Connecting to MongoDB:', MONGODB_URI);

if (!MONGODB_URI) {
  throw new Error('⚠️ MONGODB_URI is not defined in .env.local');
}

// @ts-ignore
let cached = global.mongoose;

if (!cached) {
  // @ts-ignore
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectToDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'chatgpt-clone',
      bufferCommands: false,
    }).then((mongoose) => {
      console.log('✅ MongoDB connected');
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
