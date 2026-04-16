"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const initialForm = {
  name: "",
  slug: "",
  capital: "",
  region: "",
  rulingParty: "",
  rulingPartySlug: "",
  cm: "",
  cmSlug: "",
  totalAssemblySeats: 0,
  totalLokSabhaSeats: 0,
};

export default function NewStatePage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key: string, value: string | number) => setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/states", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/admin/states");
    } else {
      const result = await res.json();
      setError(result?.error || "Failed to save state.");
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Add New State / UT</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new state profile with ruling party and CM details.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl border border-gray-100 p-6">
        {error ? <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</div> : null}
        {["name","slug","capital","region","rulingParty","rulingPartySlug","cm","cmSlug"].map((key) => (
          <div key={key}>
            <label className="text-sm font-medium text-gray-700 block mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            <input value={(form as any)[key]} onChange={(e) => handleChange(key, e.target.value)} className="w-full rounded-xl border border-gray-200 h-10 px-3 text-sm" />
          </div>
        ))}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Assembly Seats</label>
            <input value={form.totalAssemblySeats} onChange={(e) => handleChange("totalAssemblySeats", Number(e.target.value))} type="number" className="w-full rounded-xl border border-gray-200 h-10 px-3 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Lok Sabha Seats</label>
            <input value={form.totalLokSabhaSeats} onChange={(e) => handleChange("totalLokSabhaSeats", Number(e.target.value))} type="number" className="w-full rounded-xl border border-gray-200 h-10 px-3 text-sm" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">{saving ? "Saving..." : "Save State"}</button>
          <button type="button" onClick={() => router.push("/admin/states")} className="px-5 py-2 rounded-xl border border-gray-200 text-sm">Cancel</button>
        </div>
      </form>
    </div>
  );
}
