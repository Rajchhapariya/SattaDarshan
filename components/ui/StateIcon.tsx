import React from "react";
import statePathsData from "./statePaths.json";
import { Map } from "lucide-react";

const statePaths = statePathsData as Record<string, string>;

export function StateIcon({ stateName, className = "w-5 h-5", fill = "currentColor", mode = "detailed" }: { stateName: string, className?: string, fill?: string, mode?: "detailed" | "simple" }) {
  if (mode === "simple") {
    return <Map className={className} />;
  }

  const normalized = stateName.toLowerCase().trim();
  const d = statePaths[normalized];
  
  if (!d) {
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
