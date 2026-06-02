import { useI18n } from "../../i18n/useI18n";
import {
  formatEffortSignalLabel,
  formatImpactSignalLabel,
  formatUrgencySignalLabel,
} from "../../utils/formatLabels";
import type { TaskPrioritySignal } from "../../types/task";
import { cn } from "../../utils/cn";

type ScoreBreakdownProps = {
  impact: number;
  urgency: number;
  effort: number;
  className?: string;
};

export function ScoreBreakdown({ impact, urgency, effort, className }: ScoreBreakdownProps) {
  const { t, language } = useI18n();
  const impactLabel = formatImpactSignalLabel(impact as TaskPrioritySignal, language);
  const urgencyLabel = formatUrgencySignalLabel(urgency as TaskPrioritySignal, language);
  const effortLabel = formatEffortSignalLabel(effort as TaskPrioritySignal, language);

  return (
    <p
      className={cn("score-breakdown", className)}
      aria-label={t("score.breakdownAria", {
        impact: impactLabel,
        urgency: urgencyLabel,
        effort: effortLabel,
      })}
    >
      <span>
        {t("label.impact")} {impactLabel}
      </span>
      <span className="score-breakdown__sep" aria-hidden="true">
        ·
      </span>
      <span>
        {t("label.urgency")} {urgencyLabel}
      </span>
      <span className="score-breakdown__sep" aria-hidden="true">
        ·
      </span>
      <span>
        {t("label.effort")} {effortLabel}
      </span>
    </p>
  );
}
