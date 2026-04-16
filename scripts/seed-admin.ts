import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../lib/db";
import User from "../models/User";
async function main() {
  await connectDB();
  const email = process.env.ADMIN_EMAIL!;
  const password = process.env.ADMIN_PASSWORD!;
  const exists = await User.findOne({ email });
  if (exists) { console.log("Admin already exists"); process.exit(0); }
  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({ email, name: "Admin", role: "admin", passwordHash });
  console.log("✅ Admin created:", email);
  process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
