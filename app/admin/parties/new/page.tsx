"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const initialForm = {
  name: "",
  slug: "",
  abbr: "",
  tier: "National",
  president: "",
  hq: "",
  alliance: "",
  seatsLokSabha: 0,
  seatsRajyaSabha: 0,
  website: "",
  description: "",
};

export default function NewPartyPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key: string, value: string | number) => setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/parties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/admin/parties");
    } else {
      const result = await res.json();
      setError(result?.error || "Failed to save party.");
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Add New Party</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new party record with seats and alliance details.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl border border-gray-100 p-6">
        {error ? <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</div> : null}
        {[["name","Name","text"],["slug","Slug","text"],["abbr","Abbreviation","text"],["tier","Tier","text"],["president","President","text"],["hq","Headquarters","text"],["alliance","Alliance","text"],["website","Website","text"],["logo","Logo URL","text"]].map(([key,label,type]) => (
          <div key={key}>
            <label className="text-sm font-medium text-gray-700 block mb-1">{label}</label>
            <input value={(form as any)[key]} onChange={(e) => handleChange(key as string, e.target.value)} type={type as string} className="w-full rounded-xl border border-gray-200 h-10 px-3 text-sm" />
          </div>
        ))}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Lok Sabha Seats</label>
            <input value={form.seatsLokSabha} onChange={(e) => handleChange("seatsLokSabha", Number(e.target.value))} type="number" className="w-full rounded-xl border border-gray-200 h-10 px-3 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Rajya Sabha Seats</label>
            <input value={form.seatsRajyaSabha} onChange={(e) => handleChange("seatsRajyaSabha", Number(e.target.value))} type="number" className="w-full rounded-xl border border-gray-200 h-10 px-3 text-sm" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
          <textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} className="w-full rounded-2xl border border-gray-200 px-3 py-3 text-sm min-h-[140px]" />
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50">{saving ? "Saving..." : "Save Party"}</button>
          <button type="button" onClick={() => router.push("/admin/parties")} className="px-5 py-2 rounded-xl border border-gray-200 text-sm">Cancel</button>
        </div>
      </form>
    </div>
  );
}
