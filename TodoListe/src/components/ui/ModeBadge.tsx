import type { ProjectComplexityMode } from "../../types/project";
import { Badge } from "./Badge";

type ModeBadgeProps = {
  mode: ProjectComplexityMode;
};

export function ModeBadge({ mode }: ModeBadgeProps) {
  return (
    <Badge tone={mode === "complex" ? "premium" : "neutral"}>
      {mode === "complex" ? "Complex Mode" : "Simple Mode"}
    </Badge>
  );
}
