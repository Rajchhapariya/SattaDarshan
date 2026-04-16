import "dotenv/config";
import connectDB from "../lib/db";
import State from "../models/State";
import Politician from "../models/Politician";

async function main() {
  await connectDB();
  const states = await State.find().lean();
  let mlas = 0;
  for (const s of states) {
     if ((s as any).totalAssemblySeats > 0) mlas++;
  }
  console.log(`States with Assembly Seats > 0: ${mlas} out of ${states.length}`);
  const pols = await Politician.find({ state: /maharashtra/i }).lean();
  console.log(`Politicians from Maharashtra: ${pols.length}`);
  if (pols.length > 0) {
     console.log(`Sample Maharashtra Pol:`, pols[0].state, pols[0].slug);
  }
}
main().catch(console.error).finally(()=>process.exit(0));
