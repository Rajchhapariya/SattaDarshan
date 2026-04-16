import connectDB from "../lib/db";
import Politician from "../models/Politician";

async function run() {
  await connectDB();
  const res = await Politician.deleteMany({ chamber: "Vidhan Sabha" });
  console.log(`✅ Purged ${res.deletedCount} corrupted Vidhan Sabha records.`);
}
run().finally(() => process.exit(0));
