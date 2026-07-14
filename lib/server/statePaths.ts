import "server-only";
import statePathsData from "./statePaths.json";

const statePaths = statePathsData as Record<string, string>;

export function getStatePath(stateName: string): string | undefined {
  const normalized = stateName.toLowerCase().trim();
  return statePaths[normalized];
}
