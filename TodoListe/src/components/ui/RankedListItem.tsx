import type { KeyboardEvent, ReactNode } from "react";
import { ScorePill } from "./ScorePill";

type RankedListItemProps = {
  rank: number;
  title: string;
  children?: ReactNode;
  score: number;
  onClick?: () => void;
  onKeyDown?: (event: KeyboardEvent) => void;
};

export function RankedListItem({ rank, title, children, score, onClick, onKeyDown }: RankedListItemProps) {
  const interactive = Boolean(onClick);

  return (
    <div
      className={interactive ? "ranked-list__item ranked-list__item--clickable" : "ranked-list__item"}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick?.();
              }
              onKeyDown?.(event);
            }
          : undefined
      }
      aria-label={interactive ? `Open task: ${title}` : undefined}
    >
      <span className="ranked-list__rank">{rank}</span>
      <div>
        <strong>{title}</strong>
        {children}
      </div>
      <ScorePill score={score} />
    </div>
  );
}
