import { cn } from "../../utils/cn";

type ScoreBreakdownProps = {
  impact: number;
  urgency: number;
  effort: number;
  className?: string;
};

export function ScoreBreakdown({ impact, urgency, effort, className }: ScoreBreakdownProps) {
  return (
    <p
      className={cn("score-breakdown", className)}
      aria-label={`Impact ${impact}, urgency ${urgency}, effort ${effort}`}
    >
      <span>Impact {impact}</span>
      <span className="score-breakdown__sep" aria-hidden="true">
        ·
      </span>
      <span>Urgency {urgency}</span>
      <span className="score-breakdown__sep" aria-hidden="true">
        ·
      </span>
      <span>Effort {effort}</span>
    </p>
  );
}
