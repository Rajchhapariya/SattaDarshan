import "dotenv/config";
import connectDB from "../lib/db";
import Politician from "../models/Politician";

async function main() {
  await connectDB();
  const res = await Politician.aggregate([
    { $match: { chamber: "Lok Sabha" } },
    { $group: { _id: "$state", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  console.log(res);
}
main().catch(console.error).finally(()=>process.exit(0));
