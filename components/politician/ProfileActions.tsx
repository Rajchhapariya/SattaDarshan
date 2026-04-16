"use client";

import { useEffect, useMemo, useState } from "react";

type ProfileActionsProps = {
  slug: string;
  name: string;
};

export function ProfileActions({ slug, name }: ProfileActionsProps) {
  const [saved, setSaved] = useState(false);
  const url = useMemo(() => (typeof window !== "undefined" ? window.location.href : ""), []);

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem("saved-politicians") || "[]") as string[];
    setSaved(savedItems.includes(slug));
  }, [slug]);

  const toggleSave = () => {
    const savedItems = JSON.parse(localStorage.getItem("saved-politicians") || "[]") as string[];
    const next = savedItems.includes(slug) ? savedItems.filter((s) => s !== slug) : [...savedItems, slug];
    localStorage.setItem("saved-politicians", JSON.stringify(next));
    setSaved(next.includes(slug));
  };

  const share = async (type: "whatsapp" | "twitter" | "copy") => {
    if (!url) return;
    if (type === "copy") {
      await navigator.clipboard.writeText(url);
      return;
    }
    const text = encodeURIComponent(`${name} on SattaDarshan`);
    const target = type === "whatsapp"
      ? `https://wa.me/?text=${text}%20${encodeURIComponent(url)}`
      : `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`;
    window.open(target, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <button onClick={toggleSave} className="px-3 py-1.5 rounded-lg text-xs bg-indigo-50 text-indigo-700">
        {saved ? "Saved" : "Bookmark"}
      </button>
      <button onClick={() => share("whatsapp")} className="px-3 py-1.5 rounded-lg text-xs bg-green-50 text-green-700">WhatsApp</button>
      <button onClick={() => share("twitter")} className="px-3 py-1.5 rounded-lg text-xs bg-blue-50 text-blue-700">Twitter</button>
      <button onClick={() => share("copy")} className="px-3 py-1.5 rounded-lg text-xs bg-gray-100 text-gray-700">Copy Link</button>
    </div>
  );
}
