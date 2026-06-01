import { getScoreLabel } from "../../utils/scoring";

export function ScorePill({ score }: { score: number }) {
  return (
    <span className="score-pill" title={getScoreLabel(score)}>
      <strong>{score}</strong>
      <span>{getScoreLabel(score)}</span>
    </span>
  );
}
