import "dotenv/config";
import connectDB from "../lib/db";
import Party from "../models/Party";
import Politician from "../models/Politician";
import State from "../models/State";

const PARTY_ALIASES: Record<string, string> = {
  "jmm": "jharkhand-mukti-morcha",
  "trinamool-congress": "all-india-trinamool-congress",
  "apna-dal": "apna-dal-soneylal",
  "bharatiya-janta-party": "bharatiya-janata-party",
  "janata-dal": "janata-dal-united", // Assumption for most
  "akali-dal": "shiromani-akali-dal",
  "bjp": "bharatiya-janata-party",
  "inc": "indian-national-congress",
  "aap": "aam-aadmi-party",
  "bsp": "bahujan-samaj-party",
  "ncp": "nationalist-congress-party",
  "cpi-m": "communist-party-of-india-marxist",
  "tmc": "all-india-trinamool-congress",
  "sp": "samajwadi-party",
  "dmk": "dravida-munnetra-kazhagam",
  "tdp": "telugu-desam-party",
  "jdu": "janata-dal-united",
  "ysrcp": "ysr-congress-party",
  "bjd": "biju-janata-dal",
  "rjd": "rashtriya-janata-dal"
};

const STATE_ALIASES: Record<string, string> = {
  "andaman and nicobar islands": "andaman-and-nicobar-islands",
  "dadra and nagar haveli and daman and diu": "dadra-and-nagar-haveli",
  "jammu and kashmir": "jammu-and-kashmir",
  "nct of delhi": "delhi"
};

// Wikipedia scrape bugs
const GARBAGE_STATES = [
  "membership by party",
  "membership by state"
];

async function main() {
  await connectDB();
  console.log("Connected to DB.");

  let deletedCount = 0;
  let updatedStates = 0;
  let updatedParties = 0;
  let missingPartiesCreated = 0;

  const ps = await Politician.find();
  const existingParties = new Set((await Party.find({}, { slug: 1 })).map(p => p.slug));

  for (const p of ps) {
    let needsSave = false;

    // Detect garbage
    if (p.state && GARBAGE_STATES.includes(p.state.toLowerCase())) {
       await Politician.deleteOne({ _id: p._id });
       deletedCount++;
       continue;
    }

    // Fix State mappings if needed
    if (p.state) {
      const lower = p.state.toLowerCase();
      if (STATE_ALIASES[lower]) {
        p.state = STATE_ALIASES[lower];
        needsSave = true;
        updatedStates++;
      }
    }

    // Fix Party mappings
    if (p.party) {
       let currentSlug = p.party.toLowerCase();
       let foundMapping = false;

       if (PARTY_ALIASES[currentSlug]) {
          p.party = PARTY_ALIASES[currentSlug];
          const actualParty = await Party.findOne({slug: PARTY_ALIASES[currentSlug]});
          if (actualParty) p.partyName = actualParty.name;
          needsSave = true;
          updatedParties++;
          foundMapping = true;
       }

       // If after alias mapping, it still doesn't exist in existingParties
       if (!existingParties.has(p.party)) {
          // It's a genuine missing party like 'independent', 'ndpp', 'voice-of-the-people-party'
          const newSlug = p.party;
          const newName = p.partyName || newSlug.replace(/-/g, ' ');
          if (!["rowspan-4-bgcolor-ff9933", "240", "rowspan-29-bgcolor-ff9933", "rowspan-5-bgcolor-ff9933"].includes(newSlug)) {
            await Party.create({
              slug: newSlug,
              name: newName,
              tier: "RUPP"
            });
            existingParties.add(newSlug);
            missingPartiesCreated++;
          } else {
             // Invalid weird artifact party from scraping a table structure
             p.party = "independent";
             p.partyName = "Independent/Other";
             needsSave = true;
          }
       }
    }

    if (needsSave) {
      await p.save();
    }
  }

  console.log(`Garbage rows deleted: ${deletedCount}`);
  console.log(`State mappings updated: ${updatedStates}`);
  console.log(`Party mappings updated: ${updatedParties}`);
  console.log(`New generic party records created to prevent 404s: ${missingPartiesCreated}`);
}

main().catch(console.error).finally(() => process.exit(0));
