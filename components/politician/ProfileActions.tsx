"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
type ProfileActionsProps = {
  slug: string;
  name: string;
};

export function ProfileActions({ slug, name }: ProfileActionsProps) {
  const [saved, setSaved] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(typeof window !== "undefined" ? `${window.location.origin}/politicians/${slug}` : "");
  }, [slug]);

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
      <Button variant="outline" size="sm" onClick={toggleSave} className="text-xs bg-indigo-50/50 hover:bg-indigo-100 text-indigo-700 border-indigo-200">
        {saved ? "Saved" : "Bookmark"}
      </Button>
      <Button variant="outline" size="sm" onClick={() => share("whatsapp")} className="text-xs bg-green-50/50 hover:bg-green-100 text-green-700 border-green-200">
        WhatsApp
      </Button>
      <Button variant="outline" size="sm" onClick={() => share("twitter")} className="text-xs bg-blue-50/50 hover:bg-blue-100 text-blue-700 border-blue-200">
        Twitter
      </Button>
      <Button variant="outline" size="sm" onClick={() => share("copy")} className="text-xs bg-gray-50/50 hover:bg-gray-100 text-gray-700 border-gray-200">
        Copy Link
      </Button>
    </div>
  );
}
