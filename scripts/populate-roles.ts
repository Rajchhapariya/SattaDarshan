import connectDB from "../lib/db";
import Politician from "../models/Politician";

function toSlug(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function main() {
  await connectDB();
  console.log("🚀 Populating empty roles (Ministers, Governors, MLAs)...");

  // Fix PM
  await Politician.updateMany(
    { name: { $regex: /Narendra Modi/i } },
    { $set: { role: "PM" } }
  );
  console.log("✅ Restored PM role for Narendra Modi");

  // Fix Ministers (who are currently tagged as MP)
  const ministers = [
    "Shri Amit Shah",
    "Shri Rajnath Singh",
    "Shri Nitin Jairam Gadkari",
    "Smt. Nirmala Sitharaman",
    "Dr. Subrahmanyam Jaishankar",
    "Shri Piyush Goyal",
    "Shri Ashwini Vaishnaw",
    "Shri Kiren Rijiju",
    "Shri Shivraj Singh Chouhan",
    "Shri Manohar Lal"
  ];
  const ministerUpdate = await Politician.updateMany(
    { name: { $in: ministers } },
    { $set: { role: "Minister" } }
  );
  console.log(`✅ Restored ${ministerUpdate.modifiedCount} Ministers`);

  // Seed some Governors
  const governors = [
    { name: "C. P. Radhakrishnan", state: "Maharashtra", partyName: "N/A" },
    { name: "Anusuiya Uikey", state: "Manipur", partyName: "N/A" },
    { name: "R. N. Ravi", state: "Tamil Nadu", partyName: "N/A" },
    { name: "Thawar Chand Gehlot", state: "Karnataka", partyName: "N/A" },
    { name: "Arif Mohammad Khan", state: "Kerala", partyName: "N/A" },
  ];

  for (const g of governors) {
    await Politician.updateOne(
      { slug: toSlug(g.name) },
      { $set: { 
          name: g.name, slug: toSlug(g.name), 
          state: g.state, party: "n-a", partyName: g.partyName,
          role: "Governor", chamber: "Raj Bhavan", status: "Active",
          photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(g.name)}&size=300&background=random`
      }},
      { upsert: true }
    );
  }
  console.log("✅ Seeded 5 Governors");

  // Seed some MLAs (since we purged all corrupted ones earlier)
  const mlas = [
    { name: "Aaditya Thackeray", state: "Maharashtra", partyName: "Shiv Sena (UBT)" },
    { name: "Sachin Pilot", state: "Rajasthan", partyName: "INC" },
    { name: "Tejashwi Yadav", state: "Bihar", partyName: "RJD" },
    { name: "D. K. Shivakumar", state: "Karnataka", partyName: "INC" },
  ];

  for (const m of mlas) {
    await Politician.updateOne(
      { slug: toSlug(m.name) },
      { $set: { 
          name: m.name, slug: toSlug(m.name), 
          state: m.state, party: toSlug(m.partyName), partyName: m.partyName,
          role: "MLA", chamber: "State Assembly", status: "Active",
          photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&size=300&background=random`
      }},
      { upsert: true }
    );
  }
  console.log("✅ Seeded 4 key MLAs");

  console.log("🎉 Successfully populated missing roles!");
  process.exit(0);
}

main().catch(console.error);
