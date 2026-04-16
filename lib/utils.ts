import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...i: ClassValue[]) => twMerge(clsx(i));
export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
export const formatDate = (d: string) => new Date(d).toLocaleDateString("en-IN",{year:"numeric",month:"long",day:"numeric"});
