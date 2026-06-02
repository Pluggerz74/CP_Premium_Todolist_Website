import { getScoreLabel } from "../../utils/scoring";
import { getScoreTierClass } from "../../utils/formatLabels";
import { cn } from "../../utils/cn";

type ScorePillProps = {
  score: number;
  compact?: boolean;
};

export function ScorePill({ score, compact = false }: ScorePillProps) {
  return (
    <span
      className={cn("score-pill", getScoreTierClass(score), compact && "score-pill--compact")}
      title={getScoreLabel(score)}
    >
      <strong>{score}</strong>
      {compact ? null : <span>{getScoreLabel(score)}</span>}
    </span>
  );
}
