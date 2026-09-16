/**
 * Canonical SEO Slug Helpers for SattaDarshan
 * Resolves state, party, and entity names to clean canonical URL paths.
 */

const STATE_NAME_TO_SLUG: Record<string, string> = {
  "andaman & nicobar": "andaman-nicobar",
  "andaman & nicobar islands": "andaman-nicobar",
  "andaman and nicobar": "andaman-nicobar",
  "andaman and nicobar islands": "andaman-nicobar",
  "andhra pradesh": "andhra-pradesh",
  "arunachal pradesh": "arunachal-pradesh",
  "assam": "assam",
  "bihar": "bihar",
  "chandigarh": "chandigarh",
  "chhattisgarh": "chhattisgarh",
  "dadra & nh + dd": "dadra-nagar-haveli",
  "dadra & nagar haveli": "dadra-nagar-haveli",
  "dadra and nagar haveli": "dadra-nagar-haveli",
  "dadra and nagar haveli and daman and diu": "dadra-nagar-haveli",
  "daman & diu": "dadra-nagar-haveli",
  "daman and diu": "dadra-nagar-haveli",
  "delhi": "delhi",
  "nct of delhi": "delhi",
  "national capital territory of delhi": "delhi",
  "goa": "goa",
  "gujarat": "gujarat",
  "haryana": "haryana",
  "himachal pradesh": "himachal-pradesh",
  "jammu & kashmir": "jammu-kashmir",
  "jammu and kashmir": "jammu-kashmir",
  "jharkhand": "jharkhand",
  "karnataka": "karnataka",
  "kerala": "kerala",
  "ladakh": "ladakh",
  "lakshadweep": "lakshadweep",
  "madhya pradesh": "madhya-pradesh",
  "maharashtra": "maharashtra",
  "manipur": "manipur",
  "meghalaya": "meghalaya",
  "mizoram": "mizoram",
  "nagaland": "nagaland",
  "odisha": "odisha",
  "orissa": "odisha",
  "puducherry": "puducherry",
  "pondicherry": "puducherry",
  "punjab": "punjab",
  "rajasthan": "rajasthan",
  "sikkim": "sikkim",
  "tamil nadu": "tamil-nadu",
  "telangana": "telangana",
  "telengana": "telangana",
  "tripura": "tripura",
  "uttar pradesh": "uttar-pradesh",
  "uttarakhand": "uttarakhand",
  "uttaranchal": "uttarakhand",
  "west bengal": "west-bengal",
};

export function getStateCanonicalSlug(stateName?: string | null): string | undefined {
  if (!stateName) return undefined;
  const clean = stateName.toLowerCase().trim();
  return STATE_NAME_TO_SLUG[clean] || clean.replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}
