import { notFound } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import { ProfileActions } from "@/components/politician/ProfileActions";
import connectDB from "@/lib/db";
import Politician from "@/models/Politician";
import Party from "@/models/Party";

type PoliticianDetails = {
  name: string;
  photo?: string;
  role?: string;
  party?: string;
  partyName?: string;
  state?: string;
  constituency?: string;
  criminalCases?: number;
  bio?: string;
  education?: string;
  assets?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    website?: string;
  };
};

type PoliticianPageProps = {
  params: Promise<{ slug: string }>;
};

async function getPolitician(slug: string): Promise<PoliticianDetails | null> {
  try {
    await connectDB();
    const politician = await Politician.findOne({ slug }).lean() as any;
    if (!politician) return null;
    if (politician.party) {
      const party = await Party.findOne({ slug: politician.party }).lean() as any;
      if (party) politician.partyName = party.name;
    }
    return politician;
  } catch {
    return null;
  }
}
export async function generateMetadata({ params }: PoliticianPageProps) {
  const { slug } = await params;
  const p = await getPolitician(slug);
  if(!p) return {title:"Not Found"};
  return {
    title:p.name+" — "+p.role,
    description:p.bio?.slice(0,160),
    openGraph: {
      images: [{ url: `/api/og/politician/${slug}` }],
    },
  };
}
export default async function PoliticianPage({ params }: PoliticianPageProps) {
  const { slug } = await params;
  const p = await getPolitician(slug);
  if(!p) notFound();
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
          <Link href="/">Home</Link><span>›</span><Link href="/politicians">Politicians</Link><span>›</span><span className="text-gray-600">{p.name}</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 mx-auto mb-4 overflow-hidden flex items-center justify-center">
              <Avatar className="w-full h-full">
                <AvatarImage src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                <AvatarFallback className="text-4xl font-bold text-gray-300">
                  {p.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <h1 className="text-xl font-bold text-gray-900">{p.name}</h1>
            <span className="inline-block mt-2 text-xs bg-orange-50 text-orange-700 font-semibold px-3 py-1 rounded-full">{p.role}</span>
            <ProfileActions slug={slug} name={p.name} />
            <div className="mt-4 space-y-2 text-sm text-left">
              {p.partyName&&<div className="flex justify-between"><span className="text-gray-400">Party</span><Link href={"/parties/"+p.party} className="font-medium text-indigo-600 hover:underline">{p.partyName}</Link></div>}
              {p.state&&<div className="flex justify-between"><span className="text-gray-400">State</span><Link href={"/states/"+p.state?.toLowerCase().replace(/\s+/g,"-")} className="font-medium text-indigo-600 hover:underline">{p.state}</Link></div>}
              {p.constituency&&<div className="flex justify-between"><span className="text-gray-400">Constituency</span><span className="font-medium text-gray-800">{p.constituency}</span></div>}
              {p.criminalCases!==undefined&&<div className="flex justify-between"><span className="text-gray-400">Criminal Cases</span><span className={`font-bold ${p.criminalCases>0?"text-red-600":"text-green-600"}`}>{p.criminalCases}</span></div>}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-6">
          {p.bio&&<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"><h2 className="font-semibold text-gray-900 mb-3">Biography</h2><p className="text-sm text-gray-600 leading-relaxed">{p.bio}</p></div>}
          {p.education&&<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"><h2 className="font-semibold text-gray-900 mb-3">Education</h2><p className="text-sm text-gray-600">{p.education}</p></div>}
          {p.assets&&<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"><h2 className="font-semibold text-gray-900 mb-3">Assets</h2><p className="text-sm text-gray-600">{p.assets}</p></div>}
          {p.socialLinks&&<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"><h2 className="font-semibold text-gray-900 mb-3">Social Media</h2><div className="flex gap-3">{p.socialLinks.twitter&&<a href={p.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Twitter</a>}{p.socialLinks.instagram&&<a href={p.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:underline">Instagram</a>}{p.socialLinks.facebook&&<a href={p.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Facebook</a>}{p.socialLinks.website&&<a href={p.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:underline">Website</a>}</div></div>}
        </div>
      </div>
    </div>
  );
}
