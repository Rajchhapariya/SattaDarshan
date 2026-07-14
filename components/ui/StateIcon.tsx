import React from "react";
import { Map } from "lucide-react";

export function StateIcon({ 
  stateName, 
  statePath,
  className = "w-5 h-5", 
  fill = "currentColor", 
  mode = "detailed" 
}: { 
  stateName: string, 
  statePath?: string,
  className?: string, 
  fill?: string, 
  mode?: "detailed" | "simple" 
}) {
  if (mode === "simple") {
    return <Map className={className} />;
  }

  if (!statePath) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill={fill} xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" opacity="0.3" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 100 100" fill={fill} xmlns="http://www.w3.org/2000/svg">
      <path d={statePath} />
    </svg>
  );
}
