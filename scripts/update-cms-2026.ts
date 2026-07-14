import connectDB from "../lib/db";
import Politician from "../models/Politician";

function toSlug(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function getWikiPhoto(name: string) {
  try {
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(name)}&prop=pageimages&format=json&pithumbsize=500`);
    const data = await res.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    if (pageId !== "-1" && pages[pageId].thumbnail) {
      return pages[pageId].thumbnail.source;
    }
  } catch (e) { }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=300&background=random`;
}

async function main() {
  await connectDB();
  console.log("🚀 Updating Tamil Nadu and West Bengal CMs for 2026...");

  // Demote old CMs
  const oldDemoted = await Politician.updateMany(
    { name: { $in: ["M. K. Stalin", "Mamata Banerjee"] } },
    { $set: { role: "Former CM" } }
  );
  console.log(`Demoted ${oldDemoted.modifiedCount} old CMs.`);

  const NEW_CMS = [
    { name: "C. Joseph Vijay", state: "Tamil Nadu", partyName: "TVK" },
    { name: "Suvendu Adhikari", state: "West Bengal", partyName: "BJP" }
  ];

  for (const cm of NEW_CMS) {
    const slug = toSlug(cm.name);
    const photo = await getWikiPhoto(cm.name);
    await Politician.updateOne(
      { slug },
      { $set: { 
          name: cm.name, 
          slug, 
          party: toSlug(cm.partyName), 
          partyName: cm.partyName,
          state: toSlug(cm.state),
          photo,
          role: "CM", 
          chamber: "State Assembly",
          status: "Active"
      }},
      { upsert: true }
    );
    console.log(`✅ Seeded ${cm.name} (${cm.state})`);
  }

  console.log("🎉 Successfully updated the 2026 Chief Ministers!");
  process.exit(0);
}

main().catch(console.error);
