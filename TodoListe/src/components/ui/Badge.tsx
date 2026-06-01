import type { PropsWithChildren } from "react";
import { cn } from "../../utils/cn";

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "premium";

type BadgeProps = PropsWithChildren<{
  tone?: BadgeTone;
  className?: string;
}>;

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return <span className={cn("badge", `badge--${tone}`, className)}>{children}</span>;
}
