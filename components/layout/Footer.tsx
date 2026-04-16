import Link from "next/link";
export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-bold mb-2">SattaDarshan</h3>
          <p className="text-xs mt-2 text-gray-500">India&apos;s political transparency platform.</p>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm">
            {[["/politicians","Politicians"],["/parties","Parties"],["/states","States"]].map(([h,l])=>(
              <li key={h}><Link href={h} className="hover:text-white transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold mb-3">Parliament</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/parliament/lok-sabha" className="hover:text-white">Lok Sabha</Link></li>
            <li><Link href="/parliament/rajya-sabha" className="hover:text-white">Rajya Sabha</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold mb-3">Community</h4>
          <ul className="space-y-2 text-sm">

            <li><Link href="/map" className="hover:text-white">India Map</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-600">© 2025 SattaDarshan 🇮🇳</div>
    </footer>
  );
}
