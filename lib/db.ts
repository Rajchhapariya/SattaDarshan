import mongoose from "mongoose";

const URI = process.env.MONGODB_URI as string;
if (!URI) throw new Error("MONGODB_URI not defined");

let cached: { conn: any; promise: any } = (global as any).__mongoose ?? { conn: null, promise: null };
(global as any).__mongoose = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(URI);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;