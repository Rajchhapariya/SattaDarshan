import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...i: ClassValue[]) => twMerge(clsx(i));
export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
export const formatDate = (d: string) => new Date(d).toLocaleDateString("en-IN",{year:"numeric",month:"long",day:"numeric"});
export const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Safely resolves an image URL for the civic platform.
 * Proxies remote images known to enforce CORP (Cross-Origin-Resource-Policy: same-site),
 * such as sansad.in or loksabhaph.nic.in, through the server proxy /api/media/avatar.
 */
export function getCivicImageUrl(src?: string | null): string | null {
  if (!src || typeof src !== "string" || src.trim() === "") return null;
  const trimmed = src.trim();

  // If local relative asset, return as-is
  if (trimmed.startsWith("/")) return trimmed;

  try {
    const url = new URL(trimmed);
    if (
      url.hostname === "sansad.in" ||
      url.hostname.endsWith(".sansad.in") ||
      url.hostname === "loksabhaph.nic.in" ||
      url.hostname.endsWith(".nic.in")
    ) {
      return `/api/media/avatar?url=${encodeURIComponent(trimmed)}`;
    }
    return trimmed;
  } catch {
    return trimmed;
  }
}
