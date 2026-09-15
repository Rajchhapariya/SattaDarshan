import connectDB from "../lib/db";
import Politician from "../models/Politician";

async function run() {
  await connectDB();
  const roles = await Politician.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  console.log("=== ROLE COUNTS ===");
  console.log(JSON.stringify(roles, null, 2));

  const ministers = await Politician.find({ role: "Minister" }).select("name slug state partyName").lean();
  console.log(`\n=== MINISTERS (${ministers.length}) ===`);
  for (const m of ministers) {
    console.log(`${m.name} (${m.slug}) | ${m.partyName} | ${m.state}`);
  }

  process.exit(0);
}
run();
