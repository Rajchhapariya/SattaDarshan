"use client";
import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditPoliticianPage() {
  const params = useParams();
  const router = useRouter();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/politicians/${slug}`)
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
    const res = await fetch(`/api/politicians/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/admin/politicians");
    } else {
      const result = await res.json();
      setError(result?.error || "Failed to update politician.");
      setSaving(false);
    }
  }

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (!form) return <p className="text-red-600">Politician not found.</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Politician</h1>
          <p className="text-sm text-gray-500 mt-1">Update profile and constituency data.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl border border-gray-100 p-6">
        {error ? <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</div> : null}
        {["name","slug","role","party","partyName","state","constituency","chamber","education","assets"].map((key) => (
          <div key={key}>
            <label className="text-sm font-medium text-gray-700 block mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            <input value={form[key] || ""} onChange={(e) => handleChange(key, e.target.value)} className="w-full rounded-xl border border-gray-200 h-10 px-3 text-sm" />
          </div>
        ))}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Criminal Cases</label>
          <input value={form.criminalCases ?? 0} onChange={(e) => handleChange("criminalCases", Number(e.target.value))} type="number" className="w-full rounded-xl border border-gray-200 h-10 px-3 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Biography</label>
          <textarea value={form.bio || ""} onChange={(e) => handleChange("bio", e.target.value)} className="w-full rounded-2xl border border-gray-200 px-3 py-3 text-sm min-h-[140px]" />
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 disabled:opacity-50">{saving ? "Saving..." : "Update Politician"}</button>
          <button type="button" onClick={() => router.push("/admin/politicians")} className="px-5 py-2 rounded-xl border border-gray-200 text-sm">Cancel</button>
        </div>
      </form>
    </div>
  );
}
