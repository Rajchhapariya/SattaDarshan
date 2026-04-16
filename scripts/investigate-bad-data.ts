import connectDB from "../lib/db";
import Politician from "../models/Politician";

async function run() {
  await connectDB();
  const unknownPartyCount = await Politician.countDocuments({ partyName: "Unknown" });
  console.log(`Unknown party count: ${unknownPartyCount}`);
  
  const badConstCount = await Politician.countDocuments({ constituency: /previous assembly/i });
  console.log(`Bad constituency count: ${badConstCount}`);
}
run().finally(() => process.exit(0));
