import connectDB from "../lib/db";
import Politician from "../models/Politician";
import Party from "../models/Party";
import State from "../models/State";

async function deepAudit() {
  await connectDB();

  // 1. Check all politicians by role counts
  const roleCounts = await Politician.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  console.log("=== POLITICIAN ROLES BREAKDOWN ===");
  console.table(roleCounts);

  // 2. Ministers audit
  const ministers = await Politician.find({ role: "Minister" }).select("name slug partyName state chamber").lean();
  console.log(`\n=== UNION MINISTERS IN DB (${ministers.length}) ===`);
  for (const m of ministers) {
    console.log(`[MINISTER] ${m.name} (${m.slug}) | Party: ${m.partyName} | State: ${m.state} | Chamber: ${m.chamber}`);
  }

  // 3. Check duplicate names or slugs
  const duplicateSlugs = await Politician.aggregate([
    { $group: { _id: "$slug", count: { $sum: 1 }, names: { $push: "$name" } } },
    { $match: { count: { $gt: 1 } } }
  ]);
  console.log("\n=== DUPLICATE SLUGS ===", duplicateSlugs);

  // 4. Check duplicate names
  const duplicateNames = await Politician.aggregate([
    { $group: { _id: "$name", count: { $sum: 1 }, slugs: { $push: "$slug" } } },
    { $match: { count: { $gt: 1 } } }
  ]);
  console.log("\n=== DUPLICATE NAMES ===", duplicateNames);

  // 5. Check MP counts by chamber
  const lokSabhaMPs = await Politician.countDocuments({ chamber: "Lok Sabha" });
  const rajyaSabhaMPs = await Politician.countDocuments({ chamber: "Rajya Sabha" });
  console.log(`\n=== PARLIAMENT RECORD COUNTS ===`);
  console.log(`Lok Sabha members in DB: ${lokSabhaMPs}`);
  console.log(`Rajya Sabha members in DB: ${rajyaSabhaMPs}`);

  // 6. Check party alliances and seat totals
  const allParties = await Party.find().select("name abbr slug alliance seatsLokSabha seatsRajyaSabha").lean();
  console.log(`\n=== PARTIES AUDIT (${allParties.length} parties) ===`);
  for (const p of allParties) {
    console.log(`[PARTY] ${p.name} (${p.abbr || "NO_ABBR"}) | Slug: ${p.slug} | Alliance: ${p.alliance} | LS: ${p.seatsLokSabha} | RS: ${p.seatsRajyaSabha}`);
  }

  process.exit(0);
}

deepAudit().catch((err) => {
  console.error("Deep audit failed:", err);
  process.exit(1);
});
