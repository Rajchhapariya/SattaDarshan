import Link from "next/link";
import connectDB from "@/lib/db";
import State from "@/models/State";
import { StateIcon } from "@/components/ui/StateIcon";
export const metadata = { title: "States & Union Territories — India" };
async function getStates() {
  try {
    await connectDB();
    return await State.find({}).sort({ name: 1 }).lean();
  } catch { return []; }
}
export default async function StatesPage() {
  const states = await getStates();
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Browse</p>
          <h1 className="text-3xl font-bold text-gray-900">States & Union Territories</h1>
          <p className="text-sm text-gray-500 mt-2 max-w-4xl leading-relaxed">
            There are approximately 4,120+ Members of Legislative Assembly (MLAs) across India, representing 28 states and 3 union territories (Delhi, Puducherry, and Jammu & Kashmir). This total represents elected representatives in state legislative assemblies (Vidhan Sabha), with individual state sizes ranging from 32 (Sikkim) up to 403 (Uttar Pradesh).
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {states.map((s:any)=>(
            <Link key={s.slug} href={"/states/"+s.slug} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col items-center justify-center min-h-[140px] group">
              <StateIcon stateName={s.name} className="w-12 h-12 text-gray-200 group-hover:text-indigo-400 transition-colors mb-3" />
              <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 text-center">{s.name}</h3>
              <p className="text-[10px] bg-gray-50 text-gray-500 font-semibold px-2 py-0.5 mt-2 rounded uppercase tracking-wider">{s.type}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
