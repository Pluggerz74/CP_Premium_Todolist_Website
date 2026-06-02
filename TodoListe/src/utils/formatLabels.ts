import type { TaskPrioritySignal, TaskStatus } from "../types/task";
import type { TranslationKey } from "../i18n/translations";
import { translate, type Language } from "../i18n/translations";
import { INBOX_PROJECT_ID } from "../constants/inboxProject";
import type { Project } from "../types/project";

export function formatStatusLabel(status: TaskStatus, language: Language = "en"): string {
  if (status === "in-progress") return translate(language, "status.inProgress");
  if (status === "done") return translate(language, "status.done");
  return translate(language, "status.todo");
}

const taskTypeKeys: Record<string, TranslationKey> = {
  task: "taskType.task",
  subtask: "taskType.subtask",
  bug: "taskType.bug",
  feature: "taskType.feature",
  research: "taskType.research",
};

export function formatTaskTypeLabel(type: string, language: Language = "en"): string {
  const key = taskTypeKeys[type];
  return key ? translate(language, key) : type;
}

function scoreBandKey(score: number): TranslationKey {
  if (score >= 8) return "score.band.critical";
  if (score >= 6) return "score.band.high";
  if (score >= 4) return "score.band.useful";
  if (score >= 2) return "score.band.low";
  return "score.band.optional";
}

function scoreTooltipKey(score: number): TranslationKey {
  if (score >= 8) return "score.tooltip.critical";
  if (score >= 6) return "score.tooltip.high";
  if (score >= 4) return "score.tooltip.useful";
  if (score >= 2) return "score.tooltip.low";
  return "score.tooltip.optional";
}

export function formatScoreLabel(score: number, language: Language = "en"): string {
  return translate(language, scoreBandKey(score));
}

export function formatScoreTooltip(score: number, language: Language = "en"): string {
  return translate(language, scoreTooltipKey(score));
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
  return formatPrioritySignalLabel(priority as TaskPrioritySignal, language);
}

const prioritySignalKeys: Record<TaskPrioritySignal, TranslationKey> = {
  1: "priority.signal.1",
  2: "priority.signal.2",
  3: "priority.signal.3",
  4: "priority.signal.4",
  5: "priority.signal.5",
};

export function formatPrioritySignalLabel(
  priority: TaskPrioritySignal,
  language: Language = "en",
): string {
  const key = prioritySignalKeys[priority];
  return key ? translate(language, key) : String(priority);
}

export function getPrioritySignalOptions(language: Language = "en") {
  return ([1, 2, 3, 4, 5] as TaskPrioritySignal[]).map((value) => ({
    value: String(value),
    label: formatPrioritySignalLabel(value, language),
  }));
}

export function getProjectDisplayName(project: Project, language: Language = "en"): string {
  if (project.id === INBOX_PROJECT_ID) {
    return translate(language, "nav.inbox");
  }
  return project.name;
}
