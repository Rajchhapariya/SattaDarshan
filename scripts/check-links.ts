import "dotenv/config";
import connectDB from "../lib/db";
import Party from "../models/Party";
import Politician from "../models/Politician";
import State from "../models/State";

async function main() {
  await connectDB();
  const ps = await Politician.find({}, { slug: 1, party: 1, state: 1 }).lean();
  const parties = await Party.find({}, { slug: 1, name: 1, abbreviation: 1 }).lean();
  const states = await State.find({}, { slug: 1, name: 1 }).lean();
  
  const partySlugs = new Set(parties.map(p => p.slug));
  const stateSlugs = new Set(states.map(s => s.slug));
  
  const missingParties = new Set<string>();
  const missingStates = new Set<string>();

  for (const p of ps) {
    if (p.party && !partySlugs.has(p.party)) missingParties.add(p.party);
    if (p.state) {
      const stateSlug = p.state.toLowerCase().replace(/\s+/g,"-");
      if (!stateSlugs.has(stateSlug)) missingStates.add(p.state);
    }
  }
  
  console.log("Mismatched Party Slugs referenced by Politicians:", Array.from(missingParties));
  console.log("Mismatched States referenced by Politicians:", Array.from(missingStates));
  
  console.log("Available Party Slugs:", parties.map(p => ({slug: p.slug, abbr: p.abbreviation})));
}
main().catch(console.error).finally(() => process.exit(0));
