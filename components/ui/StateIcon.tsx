import React from "react";
import statePathsData from "./statePaths.json";

const statePaths = statePathsData as Record<string, string>;

export function StateIcon({ stateName, className = "w-5 h-5", fill = "currentColor" }: { stateName: string, className?: string, fill?: string }) {
  const normalized = stateName.toLowerCase().trim();
  const d = statePaths[normalized];
  
  if (!d) {
    // Return a generic fallback circle if state geo mapping missing
    return (
      <svg className={className} viewBox="0 0 100 100" fill={fill} xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" opacity="0.3" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 100 100" fill={fill} xmlns="http://www.w3.org/2000/svg">
      <path d={d} />
    </svg>
  );
}
