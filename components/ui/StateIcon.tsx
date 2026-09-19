import React from "react";
import { Map } from "lucide-react";
import { getStatePath } from "@/lib/statePaths";

export function StateIcon({
  stateName,
  statePath,
  className = "w-5 h-5",
  fill = "currentColor",
  mode = "detailed",
}: {
  stateName: string;
  statePath?: string;
  className?: string;
  fill?: string;
  mode?: "detailed" | "simple";
}) {
  const path = statePath || getStatePath(stateName);

  if (!path) {
    return <Map className={className} />;
  }

  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill={fill}
      stroke={fill}
      strokeWidth="1.2"
      strokeLinejoin="round"
      strokeLinecap="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={stateName ? `${stateName} map` : "State map"}
    >
      <path d={path} />
    </svg>
  );
}
