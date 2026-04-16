import { notFound } from "next/navigation";
import Link from "next/link";
import { PoliticianCard } from "@/components/politician/PoliticianCard";
import connectDB from "@/lib/db";
import Party from "@/models/Party";
import Politician from "@/models/Politician";

type Leader = {
  slug: string;
  name: string;
  photo?: string;
  role?: string;
  partyName?: string;
  constituency?: string;
};

type PartyDetails = {
  name: string;
  abbr?: string;
  logo?: string;
  founded?: string;
  president?: string;
  hq?: string;
  alliance?: string;
  seatsLokSabha?: number;
  seatsRajyaSabha?: number;
  leaders?: Leader[];
  states?: string[];
  ideology?: string;
};

type PartyPageProps = {
  params: { slug: string };
};

async function getParty(slug: string): Promise<PartyDetails | null> {
  try {
    await connectDB();
    const party = await Party.findOne({ slug }).lean() as any;
    if (!party) return null;
    const leaders = await Politician.find({ party: slug }).limit(12).lean();
    return { ...party, leaders };
  } catch {
    return null;
  }
}
export async function generateMetadata({ params }: PartyPageProps) {
  const { slug } = params;
  const p = await getParty(slug);
  return p ? {
    title:p.name+" — Political Party",
    openGraph: { images: [{ url: `/api/og/party/${slug}` }] },
  } : {title:"Not Found"};
}
export default async function PartyPage({ params }: PartyPageProps) {
  const { slug } = params;
  const p = await getParty(slug);
  if(!p) notFound();
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
          <Link href="/">Home</Link><span>›</span><Link href="/parties">Parties</Link><span>›</span><span className="text-gray-600">{p.name}</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-4 mb-4">
                {p.logo&&<img src={p.logo} alt={p.name} className="w-12 h-12 object-contain"/>}
                <h1 className="text-2xl font-bold text-gray-900">{p.name}</h1>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                {p.abbr&&<div className="flex justify-between"><span className="text-gray-400">Abbr.</span><span className="font-bold text-lg text-indigo-600">{p.abbr}</span></div>}
              {p.founded&&<div className="flex justify-between"><span className="text-gray-400">Founded</span><span className="font-medium">{p.founded}</span></div>}
              {p.president&&<div className="flex justify-between"><span className="text-gray-400">President</span><span className="font-medium">{p.president}</span></div>}
              {p.hq&&<div className="flex justify-between"><span className="text-gray-400">HQ</span><span className="font-medium">{p.hq}</span></div>}
              {p.alliance&&<div className="flex justify-between"><span className="text-gray-400">Alliance</span><span className="font-medium">{p.alliance}</span></div>}
              {p.seatsLokSabha!==undefined&&(
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 mt-2">
                  <div className="text-center"><div className="text-xl font-bold text-orange-600">{p.seatsLokSabha}</div><div className="text-xs text-gray-400">Lok Sabha</div></div>
                  <div className="text-center"><div className="text-xl font-bold text-indigo-600">{p.seatsRajyaSabha??0}</div><div className="text-xs text-gray-400">Rajya Sabha</div></div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-4">Party Leaders</h2>
          {!p.leaders?.length?<p className="text-sm text-gray-400">No data yet.</p>
            :<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">{p.leaders.map((l)=><PoliticianCard key={l.slug} {...l}/>)}</div>}
        </div>
      </div>
    </div>
  );
}
