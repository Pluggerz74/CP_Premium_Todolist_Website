import { useI18n } from "../../i18n/useI18n";
import { cn } from "../../utils/cn";

type ScoreBreakdownProps = {
  impact: number;
  urgency: number;
  effort: number;
  className?: string;
};

export function ScoreBreakdown({ impact, urgency, effort, className }: ScoreBreakdownProps) {
  const { t } = useI18n();

  return (
    <p
      className={cn("score-breakdown", className)}
      aria-label={t("score.breakdownAria", { impact, urgency, effort })}
    >
      <span>
        {t("label.impact")} {impact}
      </span>
      <span className="score-breakdown__sep" aria-hidden="true">
        ·
      </span>
      <span>
        {t("label.urgency")} {urgency}
      </span>
      <span className="score-breakdown__sep" aria-hidden="true">
        ·
      </span>
      <span>
        {t("label.effort")} {effort}
      </span>
    </p>
  );
}
