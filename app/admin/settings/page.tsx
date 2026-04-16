"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [maintenance, setMaintenance] = useState(false);
  const [siteTitle, setSiteTitle] = useState("SattaDarshan");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-5">
        <div>
          <p className="text-sm font-semibold mb-1">Site Title</p>
          <input value={siteTitle} onChange={(e) => setSiteTitle(e.target.value)} className="w-full sm:w-96 h-10 px-3 rounded-xl border border-gray-200 text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <input id="maintenance" type="checkbox" checked={maintenance} onChange={(e) => setMaintenance(e.target.checked)} />
          <label htmlFor="maintenance" className="text-sm">Maintenance Mode</label>
        </div>
        <button className="px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold">Save Settings</button>
      </div>
    </div>
  );
}
