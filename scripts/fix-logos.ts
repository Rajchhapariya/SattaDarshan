import "dotenv/config";
import connectDB from "../lib/db";
import Party from "../models/Party";

async function main() {
  await connectDB();
  const parties = await Party.find();
  let updated = 0;
  for (const p of parties) {
    p.logo = `/flags/${p.slug}.png`;
    await p.save();
    updated++;
  }
  console.log(`✅ Updated ${updated} parties with logo URLs!`);
}
main().catch(console.error).finally(() => process.exit(0));
