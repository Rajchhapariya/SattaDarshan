import { notFound } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/db";
import State from "@/models/State";
import Politician from "@/models/Politician";
import { PoliticianCard } from "@/components/politician/PoliticianCard";
import { StateMap } from "@/components/state/StateMap";
import { StateIcon } from "@/components/ui/StateIcon";

type StateDetails = {
  slug: string;
  name: string;
  capital?: string;
  rulingParty?: string;
  rulingPartySlug?: string;
  cm?: string;
  totalAssemblySeats?: number;
  totalLokSabhaSeats?: number;
};

type StatePageProps = {
  params: { state: string };
};

function slugToStateRegex(slug: string) {
  const escaped = slug.split("-").map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("\\s*");
  return new RegExp(`^${escaped}$`, "i");
}

async function getState(slug: string): Promise<StateDetails | null> {
  try {
    await connectDB();
    return (await State.findOne({ slug }).lean()) as StateDetails | null;
  } catch {
    return null;
  }
}

async function getStatePoliticians(stateSlug: string) {
  await connectDB();
  const regex = slugToStateRegex(stateSlug);
  return await Politician.find({ state: regex }).limit(100).lean();
}

export async function generateMetadata({ params }: StatePageProps) {
  const { state } = params;
  const s = await getState(state);
  return { title: s ? s.name + " — State" : "Not Found" };
}

export default async function StatePage({ params }: StatePageProps) {
  const { state } = params;
  const s = await getState(state);
  if (!s) notFound();
  const politicians = await getStatePoliticians(state);
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
          <Link href="/">Home</Link><span>›</span><Link href="/states">States</Link><span>›</span><span className="text-gray-600">{s.name}</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3">
             <StateIcon stateName={s.name} className="w-8 h-8 text-indigo-500" />
             <h1 className="text-2xl font-bold text-gray-900">{s.name}</h1>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            {s.capital&&<div className="flex justify-between"><span className="text-gray-400">Capital</span><span className="font-medium">{s.capital}</span></div>}
            {s.rulingParty&&<div className="flex justify-between"><span className="text-gray-400">Ruling Party</span><Link href={"/parties/"+s.rulingPartySlug} className="font-medium text-indigo-600 hover:underline">{s.rulingParty}</Link></div>}
            {s.cm&&<div className="flex justify-between"><span className="text-gray-400">Chief Minister</span><span className="font-medium">{s.cm}</span></div>}
            {(s.totalAssemblySeats ?? 0) > 0 && <div className="flex justify-between"><span className="text-gray-400">Assembly Seats</span><span className="font-medium">{s.totalAssemblySeats}</span></div>}
            {(s.totalLokSabhaSeats ?? 0) > 0 && <div className="flex justify-between"><span className="text-gray-400">Lok Sabha Seats</span><span className="font-medium">{s.totalLokSabhaSeats}</span></div>}
          </div>
          </div>
          <div>
            <StateMap stateName={s.name} slug={state} />
          </div>
        </div>
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Politicians from {s.name}</h2>
          {politicians.length === 0 ? (
            <p className="text-sm text-gray-400">No politician profiles are currently available for this state.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {politicians.map((p:any) => (
                <PoliticianCard
                   key={p.slug}
                   slug={p.slug}
                   name={p.name}
                   photo={p.photo}
                   role={p.role}
                   partyName={p.partyName}
                   constituency={p.constituency}
                   state={p.state}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
