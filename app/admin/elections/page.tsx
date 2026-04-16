const mock = [
  { year: 2024, region: "India (Lok Sabha)", winner: "NDA", seats: 293 },
  { year: 2023, region: "Madhya Pradesh", winner: "BJP", seats: 163 },
  { year: 2023, region: "Rajasthan", winner: "BJP", seats: 115 },
];

export default function AdminElectionsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Election Data Management</h1>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Year</th>
              <th className="px-4 py-3 text-left">Region</th>
              <th className="px-4 py-3 text-left">Winner</th>
              <th className="px-4 py-3 text-left">Seats</th>
            </tr>
          </thead>
          <tbody>
            {mock.map((e) => (
              <tr key={`${e.year}-${e.region}`} className="border-t border-gray-50">
                <td className="px-4 py-3">{e.year}</td>
                <td className="px-4 py-3">{e.region}</td>
                <td className="px-4 py-3">{e.winner}</td>
                <td className="px-4 py-3">{e.seats}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
