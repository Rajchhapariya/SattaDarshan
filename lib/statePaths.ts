import statePathsData from "./server/statePaths.json";

const statePaths = statePathsData as Record<string, string>;

function normalizeKey(str: string): string {
  return (str || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\+/g, " ")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

const ALIAS_MAP: Record<string, string> = {
  [normalizeKey("Dadra & NH + DD")]: normalizeKey(
    "Dadra and Nagar Haveli and Daman and Diu",
  ),
  [normalizeKey("Dadra & Nagar Haveli")]: normalizeKey(
    "Dadra and Nagar Haveli and Daman and Diu",
  ),
  [normalizeKey("Daman & Diu")]: normalizeKey(
    "Dadra and Nagar Haveli and Daman and Diu",
  ),
  [normalizeKey("Dadra and Nagar Haveli")]: normalizeKey(
    "Dadra and Nagar Haveli and Daman and Diu",
  ),
  [normalizeKey("Daman and Diu")]: normalizeKey(
    "Dadra and Nagar Haveli and Daman and Diu",
  ),
  [normalizeKey("Andaman & Nicobar")]: normalizeKey(
    "Andaman and Nicobar Islands",
  ),
  [normalizeKey("Andaman & Nicobar Islands")]: normalizeKey(
    "Andaman and Nicobar Islands",
  ),
  [normalizeKey("Jammu & Kashmir")]: normalizeKey("Jammu and Kashmir"),
  [normalizeKey("NCT of Delhi")]: normalizeKey("Delhi"),
  [normalizeKey("National Capital Territory of Delhi")]: normalizeKey("Delhi"),
  [normalizeKey("Orissa")]: normalizeKey("Odisha"),
  [normalizeKey("Pondicherry")]: normalizeKey("Puducherry"),
  [normalizeKey("Uttaranchal")]: normalizeKey("Uttarakhand"),
  [normalizeKey("Telengana")]: normalizeKey("Telangana"),
};

export function getStatePath(stateName?: string | null): string | undefined {
  if (!stateName) return undefined;
  const norm = normalizeKey(stateName);
  const target = ALIAS_MAP[norm] || norm;
  return statePaths[target];
}

export default getStatePath;
