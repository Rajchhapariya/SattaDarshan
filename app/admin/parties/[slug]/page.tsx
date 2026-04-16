"use client";
import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditPartyPage() {
  const params = useParams();
  const router = useRouter();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/parties/${slug}`)
      .then((r) => r.json())
      .then((data) => { setForm(data); setLoading(false); })
      .catch(() => { setForm(null); setLoading(false); });
  }, [slug]);

  const handleChange = (key: string, value: any) => setForm((prev: any) => ({ ...prev, [key]: value }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!slug) return;
    setSaving(true);
    setError("");
    const res = await fetch(`/api/parties/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/admin/parties");
    } else {
      const result = await res.json();
      setError(result?.error || "Failed to update party.");
      setSaving(false);
    }
  }

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (!form) return <p className="text-red-600">Party not found.</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Party</h1>
          <p className="text-sm text-gray-500 mt-1">Update party metadata and seat counts.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl border border-gray-100 p-6">
        {error ? <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</div> : null}
        {[["name","Name"],["slug","Slug"],["abbr","Abbreviation"],["tier","Tier"],["president","President"],["hq","Headquarters"],["alliance","Alliance"],["website","Website"],["ideology","Ideology"],["logo","Logo URL"]].map(([key,label]) => (
          <div key={key as string}>
            <label className="text-sm font-medium text-gray-700 block mb-1">{label}</label>
            <input value={form[key as string] || ""} onChange={(e) => handleChange(key as string, e.target.value)} className="w-full rounded-xl border border-gray-200 h-10 px-3 text-sm" />
          </div>
        ))}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Lok Sabha Seats</label>
            <input value={form.seatsLokSabha ?? 0} onChange={(e) => handleChange("seatsLokSabha", Number(e.target.value))} type="number" className="w-full rounded-xl border border-gray-200 h-10 px-3 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Rajya Sabha Seats</label>
            <input value={form.seatsRajyaSabha ?? 0} onChange={(e) => handleChange("seatsRajyaSabha", Number(e.target.value))} type="number" className="w-full rounded-xl border border-gray-200 h-10 px-3 text-sm" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
          <textarea value={form.description || ""} onChange={(e) => handleChange("description", e.target.value)} className="w-full rounded-2xl border border-gray-200 px-3 py-3 text-sm min-h-[140px]" />
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50">{saving ? "Saving..." : "Update Party"}</button>
          <button type="button" onClick={() => router.push("/admin/parties")} className="px-5 py-2 rounded-xl border border-gray-200 text-sm">Cancel</button>
        </div>
      </form>
    </div>
  );
}
