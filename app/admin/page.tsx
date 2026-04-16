import Link from "next/link";
export default function AdminDashboard() {
  const cards = [
    {href:"/admin/politicians",label:"Politicians",desc:"Add, edit, delete politicians",color:"orange"},
    {href:"/admin/parties",label:"Parties",desc:"Manage political parties",color:"indigo"},
    {href:"/admin/states",label:"States",desc:"Update state information",color:"blue"},
  ];
  const recent = [
    "Imported 539 Lok Sabha MPs",
    "Enriched politician photos and bios",
    "Updated state ruling party data",
    "Added leadership records (PM/CM/Presidents)",
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(c=>(
          <Link key={c.href} href={c.href} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 group">
            <h3 className="font-bold text-gray-900 group-hover:text-orange-600">{c.label}</h3>
            <p className="text-sm text-gray-500 mt-1">{c.desc}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-3">Recent Activity</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          {recent.map((r) => <li key={r}>• {r}</li>)}
        </ul>
      </div>
    </div>
  );
}
