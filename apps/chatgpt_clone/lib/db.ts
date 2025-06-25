import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('⚠️ MONGODB_URI is not defined in .env.local')
}

interface MongooseGlobal {
  mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

const globalWithMongoose = global as typeof globalThis & MongooseGlobal

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null }
}

let cached = globalWithMongoose.mongoose

export const connectToDB = async () => {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: 'chatgpt-clone',
        bufferCommands: false,
      })
      .then((mongoose) => {
        console.log('✅ MongoDB connected')
        return mongoose
      })
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error)
        throw error
      })
  }

  cached.conn = await cached.promise
  return cached.conn
}
