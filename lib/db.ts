import mongoose from "mongoose";

let cached: { conn: any; promise: any } = (global as any).__mongoose ?? {
  conn: null,
  promise: null,
};
(global as any).__mongoose = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not defined");

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
