import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../../utils/cn";

type CardProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("card", className)} {...props}>
      {children}
    </div>
  );
}
