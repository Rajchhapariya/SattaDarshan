import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import connectDB from "../lib/db";
import User from "../models/User";
import bcrypt from "bcryptjs";

async function main() {
  await connectDB();
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash("Admin@12345", 12);
  await User.create({
    email: "admin@sattadarshan.in",
    name: "Admin",
    role: "admin",
    passwordHash,
  });
  console.log("✅ Admin reset successfully");
  console.log("Email: admin@sattadarshan.in");
  console.log("Password: Admin@12345");
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });