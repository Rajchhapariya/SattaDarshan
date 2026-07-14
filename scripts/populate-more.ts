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
  console.log("🚀 Seeding President and more MLAs...");

  // Seed President
  const presidentName = "Droupadi Murmu";
  const presidentPhoto = await getWikiPhoto(presidentName);
  await Politician.updateOne(
    { slug: toSlug(presidentName) },
    { $set: { 
        name: presidentName, slug: toSlug(presidentName), 
        state: "Odisha", party: "n-a", partyName: "N/A",
        role: "President", chamber: "Rashtrapati Bhavan", status: "Active",
        photo: presidentPhoto
    }},
    { upsert: true }
  );
  console.log("✅ Seeded President Droupadi Murmu");

  // Seed more MLAs
  const mlas = [
    { name: "Siddaramaiah", state: "Karnataka", partyName: "INC" }, // he is CM but let's add some actual MLAs
    { name: "Ajit Pawar", state: "Maharashtra", partyName: "NCP" },
    { name: "K. T. Rama Rao", state: "Telangana", partyName: "BRS" },
    { name: "Harish Rao", state: "Telangana", partyName: "BRS" },
    { name: "Udhayanidhi Stalin", state: "Tamil Nadu", partyName: "DMK" },
    { name: "Edappadi K. Palaniswami", state: "Tamil Nadu", partyName: "AIADMK" },
    { name: "O. Panneerselvam", state: "Tamil Nadu", partyName: "AIADMK" },
    { name: "Shivpal Singh Yadav", state: "Uttar Pradesh", partyName: "SP" },
    { name: "Azam Khan", state: "Uttar Pradesh", partyName: "SP" },
    { name: "Saurabh Bharadwaj", state: "Delhi", partyName: "AAP" },
    { name: "Gopal Rai", state: "Delhi", partyName: "AAP" },
    { name: "Kailash Gahlot", state: "Delhi", partyName: "AAP" },
    { name: "Imran Hussain", state: "Delhi", partyName: "AAP" },
    { name: "Ramesh Jarkiholi", state: "Karnataka", partyName: "BJP" },
    { name: "Laxman Savadi", state: "Karnataka", partyName: "INC" },
    { name: "V. D. Satheesan", state: "Kerala", partyName: "INC" },
    { name: "P. K. Kunhalikutty", state: "Kerala", partyName: "IUML" }
  ];

  for (const m of mlas) {
    const photo = await getWikiPhoto(m.name);
    await Politician.updateOne(
      { slug: toSlug(m.name) },
      { $set: { 
          name: m.name, slug: toSlug(m.name), 
          state: m.state, party: toSlug(m.partyName), partyName: m.partyName,
          role: "MLA", chamber: "State Assembly", status: "Active",
          photo
      }},
      { upsert: true }
    );
  }
  console.log(`✅ Seeded ${mlas.length} more MLAs`);

  console.log("🎉 Successfully seeded President and more MLAs!");
  process.exit(0);
}

main().catch(console.error);
