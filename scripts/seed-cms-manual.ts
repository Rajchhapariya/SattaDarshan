import connectDB from "../lib/db";
import Politician from "../models/Politician";

function toSlug(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const CMS = [
  { state: "Andhra Pradesh", name: "N. Chandrababu Naidu", partyName: "TDP" },
  { state: "Arunachal Pradesh", name: "Pema Khandu", partyName: "BJP" },
  { state: "Assam", name: "Himanta Biswa Sarma", partyName: "BJP" },
  { state: "Bihar", name: "Nitish Kumar", partyName: "JDU" },
  { state: "Chhattisgarh", name: "Vishnu Deo Sai", partyName: "BJP" },
  { state: "Delhi", name: "Atishi", partyName: "AAP" },
  { state: "Goa", name: "Pramod Sawant", partyName: "BJP" },
  { state: "Gujarat", name: "Bhupendrabhai Patel", partyName: "BJP" },
  { state: "Haryana", name: "Nayab Singh Saini", partyName: "BJP" },
  { state: "Himachal Pradesh", name: "Sukhvinder Singh Sukhu", partyName: "INC" },
  { state: "Jammu and Kashmir", name: "Omar Abdullah", partyName: "JKNC" },
  { state: "Jharkhand", name: "Hemant Soren", partyName: "JMM" },
  { state: "Karnataka", name: "Siddaramaiah", partyName: "INC" },
  { state: "Kerala", name: "Pinarayi Vijayan", partyName: "CPI(M)" },
  { state: "Madhya Pradesh", name: "Mohan Yadav", partyName: "BJP" },
  { state: "Maharashtra", name: "Devendra Fadnavis", partyName: "BJP" },
  { state: "Manipur", name: "N. Biren Singh", partyName: "BJP" },
  { state: "Meghalaya", name: "Conrad Sangma", partyName: "NPP" },
  { state: "Mizoram", name: "Lalduhoma", partyName: "ZPM" },
  { state: "Nagaland", name: "Neiphiu Rio", partyName: "NDPP" },
  { state: "Odisha", name: "Mohan Charan Majhi", partyName: "BJP" },
  { state: "Puducherry", name: "N. Rangasamy", partyName: "AINRC" },
  { state: "Punjab", name: "Bhagwant Mann", partyName: "AAP" },
  { state: "Rajasthan", name: "Bhajan Lal Sharma", partyName: "BJP" },
  { state: "Sikkim", name: "Prem Singh Tamang", partyName: "SKM" },
  { state: "Tamil Nadu", name: "M. K. Stalin", partyName: "DMK" },
  { state: "Telangana", name: "Revanth Reddy", partyName: "INC" },
  { state: "Tripura", name: "Manik Saha", partyName: "BJP" },
  { state: "Uttar Pradesh", name: "Yogi Adityanath", partyName: "BJP" },
  { state: "Uttarakhand", name: "Pushkar Singh Dhami", partyName: "BJP" },
  { state: "West Bengal", name: "Mamata Banerjee", partyName: "TMC" }
];

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
  console.log("🚀 Starting Manual Chief Ministers Seed...");

  // Delete broken slug
  await Politician.deleteMany({ slug: "list" });
  console.log("🗑️ Deleted broken 'list' CMs.");

  // Update PM photo
  await Politician.updateOne(
    { slug: "narendra-modi" },
    { $set: { photo: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Official_Photograph_of_Prime_Minister_Narendra_Modi_Portrait.png" } }
  );
  console.log("🖼️ Fixed PM Narendra Modi's photo.");

  // Seed CMs
  let imported = 0;
  for (const m of CMS) {
    const slug = toSlug(m.name);
    const photo = await getWikiPhoto(m.name);
    
    // Normalization
    if (m.partyName === "Bharatiya Janata Party") m.partyName = "BJP";
    if (m.partyName === "Indian National Congress") m.partyName = "INC";
    if (m.partyName === "Aam Aadmi Party") m.partyName = "AAP";

    await Politician.updateOne(
      { slug }, 
      { $set: { 
          name: m.name, 
          slug, 
          party: toSlug(m.partyName), 
          partyName: m.partyName,
          state: toSlug(m.state),
          photo,
          role: "CM", 
          chamber: "State Assembly",
          status: "Active"
        } 
      }, 
      { upsert: true }
    );
    imported++;
    console.log(`✅ Seeded ${m.name} (${m.state})`);
  }

  console.log(`🎉 Successfully seeded ${imported} Chief Ministers!`);
  process.exit(0);
}

main().catch(console.error);
