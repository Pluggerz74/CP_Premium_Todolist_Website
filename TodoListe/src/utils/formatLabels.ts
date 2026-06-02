import type { TaskStatus } from "../types/task";
import type { TranslationKey } from "../i18n/translations";
import { translate, type Language } from "../i18n/translations";

export function formatStatusLabel(status: TaskStatus, language: Language = "en"): string {
  if (status === "in-progress") return translate(language, "status.inProgress");
  if (status === "done") return translate(language, "status.done");
  return translate(language, "status.todo");
}

export function formatTaskTypeLabel(type: string): string {
  if (type === "subtask") return "Subtask";
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function getStatusTone(status: TaskStatus): "neutral" | "success" | "warning" {
  if (status === "done") return "success";
  if (status === "in-progress") return "warning";
  return "neutral";
}

export function getScoreTierClass(score: number): string {
  if (score >= 8) return "score-pill--elite";
  if (score >= 6) return "score-pill--high";
  if (score >= 4) return "score-pill--mid";
  if (score >= 2) return "score-pill--low";
  return "score-pill--minimal";
}

export function getPriorityLabel(priority: number, language: Language = "en"): string {
  const key: TranslationKey =
    priority >= 5
      ? "priority.critical"
      : priority >= 4
        ? "priority.high"
        : priority >= 3
          ? "priority.medium"
          : priority >= 2
            ? "priority.low"
            : "priority.minimal";
  return translate(language, key);
}
