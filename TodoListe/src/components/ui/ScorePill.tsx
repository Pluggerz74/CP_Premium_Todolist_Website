import { useI18n } from "../../i18n/useI18n";
import { formatScoreLabel, formatScoreTooltip, getScoreTierClass } from "../../utils/formatLabels";
import { cn } from "../../utils/cn";

type ScorePillProps = {
  score: number;
  compact?: boolean;
};

export function ScorePill({ score, compact = false }: ScorePillProps) {
  const { language } = useI18n();
  const label = formatScoreLabel(score, language);
  const tooltip = formatScoreTooltip(score, language);

  return (
    <span
      className={cn("score-pill", getScoreTierClass(score), compact && "score-pill--compact")}
      title={tooltip}
    >
      <strong>{score}</strong>
      {compact ? null : <span>{label}</span>}
    </span>
  );
}
