import connectDB from "@/lib/db";
import Politician from "@/models/Politician";
import { LokSabhaClient } from "./LokSabhaClient";

export const metadata = {
  title: "18th Lok Sabha — Members of Parliament",
  description: "Explore the comprehensive directory of the 18th Lok Sabha of India with 3D seating chamber visualization, constituency mappings, and party affiliations.",
};

export const revalidate = 3600;

export default async function LokSabhaPage() {
  await connectDB();
  const rawMps = await Politician.find({ chamber: "Lok Sabha" })
    .select("name slug state partyName photo constituency")
    .sort({ state: 1, name: 1 })
    .lean();

  const mps = JSON.parse(JSON.stringify(rawMps));

  // Extract unique states and parties for filters
  const statesSet = new Set<string>();
  const partiesSet = new Set<string>();

  mps.forEach((mp: any) => {
    if (mp.state) statesSet.add(mp.state);
    if (mp.partyName) partiesSet.add(mp.partyName);
  });

  const states = Array.from(statesSet).sort();
  const parties = Array.from(partiesSet).sort();

  return <LokSabhaClient mps={mps} states={states} parties={parties} />;
}
