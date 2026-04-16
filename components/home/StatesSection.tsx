import Link from "next/link";
const FEATURED=[{name:"Uttar Pradesh",slug:"uttar-pradesh",seats:403},{name:"Maharashtra",slug:"maharashtra",seats:288},{name:"West Bengal",slug:"west-bengal",seats:294},{name:"Bihar",slug:"bihar",seats:243},{name:"Tamil Nadu",slug:"tamil-nadu",seats:234},{name:"Karnataka",slug:"karnataka",seats:224}];
export function StatesSection() {
  return (
    <section className="py-14 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div><p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">States</p><h2 className="text-2xl font-bold text-gray-900">Major States</h2></div>
          <Link href="/states" className="text-sm text-blue-600 font-medium">All 36 →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {FEATURED.map(s=>(
            <Link key={s.slug} href={"/states/"+s.slug} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4 text-center group">
              <div className="font-semibold text-sm text-gray-900 group-hover:text-blue-700">{s.name}</div>
              <div className="text-xs text-gray-400 mt-1">{s.seats} seats</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
