import "dotenv/config";
import connectDB from "../lib/db";
import Party from "../models/Party";

async function main() {
  await connectDB();
  const ps = await Party.find({ slug: /bjp|bharatiya/i }).lean();
  console.log(ps.map(p => p.slug));
}
main().catch(console.error).finally(() => process.exit(0));
