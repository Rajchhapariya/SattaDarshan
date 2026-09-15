import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import connectDB from "../lib/db";
import State from "../models/State";
import Politician from "../models/Politician";
import Party from "../models/Party";

async function audit() {
  await connectDB();
  console.log("CONNECTED TO DB");

  // 1. Audit States
  const states = await State.find().sort({ name: 1 }).lean();
  console.log(`\n=== STATES AUDIT (${states.length} states) ===`);
  for (const s of states) {
    console.log(`[STATE] ${s.name} | CM: ${s.cm} | RulingParty: ${s.rulingParty} | CM-Slug: ${s.cmSlug}`);
  }

  // 2. Audit Politicians with role CM
  const cms = await Politician.find({ role: "CM" }).sort({ state: 1 }).lean();
  console.log(`\n=== POLITICIANS WITH ROLE 'CM' (${cms.length} records) ===`);
  for (const c of cms) {
    console.log(`[CM] ${c.name} (${c.slug}) | State: ${c.state} | Party: ${c.partyName} | Status: ${c.status}`);
  }

  // 3. Search for known former CMs still marked as active or CM
  const formerNames = [
    "Ashok Gehlot",
    "Shivraj Singh Chouhan",
    "Bhupesh Baghel",
    "K. Chandrashekar Rao",
    "Naveen Patnaik",
    "Y. S. Jagan Mohan Reddy",
    "Manohar Lal Khattar",
    "Zoramthanga",
    "Arvind Kejriwal"
  ];
  console.log(`\n=== FORMER LEADERS STATUS IN DB ===`);
  for (const name of formerNames) {
    const p = (await Politician.findOne({ name: new RegExp(name, "i") }).lean()) as any;
    if (p) {
      console.log(`[FOUND] ${p.name} | Role: ${p.role} | State: ${p.state} | Status: ${p.status} | Slug: ${p.slug}`);
    } else {
      console.log(`[NOT FOUND] ${name}`);
    }
  }

  // 4. Party Counts and Seat distributions
  const parties = await Party.find().sort({ seatsLokSabha: -1 }).limit(10).lean();
  console.log(`\n=== TOP PARTIES BY LOK SABHA SEATS ===`);
  for (const party of parties) {
    console.log(`[PARTY] ${party.name} (${party.abbr}) | Alliance: ${party.alliance} | LS Seats: ${party.seatsLokSabha} | RS Seats: ${party.seatsRajyaSabha}`);
  }

  process.exit(0);
}

audit().catch((err) => {
  console.error("Audit error:", err);
  process.exit(1);
});
