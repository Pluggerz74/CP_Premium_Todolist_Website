import { getScoreLabel } from "../../utils/scoring";
import { getScoreTierClass } from "../../utils/formatLabels";
import { cn } from "../../utils/cn";

export function ScorePill({ score }: { score: number }) {
  return (
    <span className={cn("score-pill", getScoreTierClass(score))} title={getScoreLabel(score)}>
      <strong>{score}</strong>
      <span>{getScoreLabel(score)}</span>
    </span>
  );
}
