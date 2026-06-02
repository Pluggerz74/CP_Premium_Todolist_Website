import type { Task } from "../types/task";
import type { Language } from "../i18n/translations";
import { formatScoreLabel } from "./formatLabels";

export type ScoreInput = Pick<Task, "impact" | "urgency" | "effort">;

export function calculateHighValueScore(task: ScoreInput): number {
  return task.impact + task.urgency - task.effort;
}

export function withHighValueScore<T extends ScoreInput>(task: T): T & { highValueScore: number } {
  return { ...task, highValueScore: calculateHighValueScore(task) };
}

/** @deprecated Prefer formatScoreLabel(score, language) in UI code. */
export function getScoreLabel(score: number, language: Language = "en"): string {
  return formatScoreLabel(score, language);
}

export function sortByHighValueScore(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => calculateHighValueScore(b) - calculateHighValueScore(a));
}
