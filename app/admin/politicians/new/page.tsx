"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const initialForm = {
  name: "",
  slug: "",
  role: "",
  party: "",
  partyName: "",
  state: "",
  constituency: "",
  chamber: "",
  education: "",
  assets: "",
  criminalCases: 0,
  bio: "",
};

export default function NewPoliticianPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key: string, value: string | number) => setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/politicians", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/admin/politicians");
    } else {
      const result = await res.json();
      setError(result?.error || "Failed to save politician.");
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Add New Politician</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new politician profile for the admin panel.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl border border-gray-100 p-6">
        {error ? <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</div> : null}
        {[{key:"name",label:"Name",type:"text"},{key:"slug",label:"Slug",type:"text"},{key:"role",label:"Role",type:"text"},{key:"party",label:"Party Slug",type:"text"},{key:"partyName",label:"Party Name",type:"text"},{key:"state",label:"State",type:"text"},{key:"constituency",label:"Constituency",type:"text"},{key:"chamber",label:"Chamber",type:"text"},{key:"education",label:"Education",type:"text"},{key:"assets",label:"Assets",type:"text"}].map((field) => (
          <div key={field.key}>
            <label className="text-sm font-medium text-gray-700 block mb-1">{field.label}</label>
            <input value={(form as any)[field.key]} onChange={(e) => handleChange(field.key, e.target.value)} type={field.type} className="w-full rounded-xl border border-gray-200 h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
          </div>
        ))}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Criminal Cases</label>
          <input value={form.criminalCases} onChange={(e) => handleChange("criminalCases", Number(e.target.value))} type="number" className="w-full rounded-xl border border-gray-200 h-10 px-3 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Biography</label>
          <textarea value={form.bio} onChange={(e) => handleChange("bio", e.target.value)} className="w-full rounded-2xl border border-gray-200 px-3 py-3 text-sm min-h-[140px]" />
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 disabled:opacity-50">{saving ? "Saving..." : "Save Politician"}</button>
          <button type="button" onClick={() => router.push("/admin/politicians")} className="px-5 py-2 rounded-xl border border-gray-200 text-sm">Cancel</button>
        </div>
      </form>
    </div>
  );
}
