import connectDB from "@/lib/db";
import Politician from "@/models/Politician";
import { RajyaSabhaClient } from "./RajyaSabhaClient";

export const metadata = {
  title: "Rajya Sabha — Council of States",
  description: "Directory of the Rajya Sabha (Upper House) of India's Parliament with 3D seating chamber visualization, party representations, and state distributions.",
};

export const revalidate = 3600;

export default async function RajyaSabhaPage() {
  await connectDB();
  const rawMps = await Politician.find({ chamber: "Rajya Sabha" })
    .select("name slug state partyName photo")
    .sort({ state: 1, name: 1 })
    .lean();

  const mps = JSON.parse(JSON.stringify(rawMps));

  const statesSet = new Set<string>();
  const partiesSet = new Set<string>();

  mps.forEach((mp: any) => {
    if (mp.state) statesSet.add(mp.state);
    if (mp.partyName) partiesSet.add(mp.partyName);
  });

  const states = Array.from(statesSet).sort();
  const parties = Array.from(partiesSet).sort();

  return <RajyaSabhaClient mps={mps} states={states} parties={parties} />;
}
