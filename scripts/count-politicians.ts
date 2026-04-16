import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
import connectDB from "../lib/db";
import Politician from "../models/Politician";

async function main() {
  await connectDB();
  const total = await Politician.countDocuments();
  const mps = await Politician.countDocuments({ chamber: "Lok Sabha" });
  console.log("Total politicians in DB:", total);
  console.log("Lok Sabha MPs:", mps);
  process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });