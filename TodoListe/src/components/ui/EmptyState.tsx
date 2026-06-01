import type { ReactNode } from "react";
import { cn } from "../../utils/cn";
import { Card } from "./Card";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: string;
  variant?: "default" | "subtle";
  action?: ReactNode;
};

export function EmptyState({
  title,
  description,
  icon = "✦",
  variant = "default",
  action,
}: EmptyStateProps) {
  return (
    <Card className={cn("empty-state", variant === "subtle" && "empty-state--subtle")}>
      <div className="empty-state__icon" aria-hidden="true">
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action ? <div className="empty-state__action">{action}</div> : null}
    </Card>
  );
}
