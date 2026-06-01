import type { Task } from "../types/task";

export type ScoreInput = Pick<Task, "impact" | "urgency" | "effort">;

export function calculateHighValueScore(task: ScoreInput): number {
  return task.impact + task.urgency - task.effort;
}

export function withHighValueScore<T extends ScoreInput>(task: T): T & { highValueScore: number } {
  return { ...task, highValueScore: calculateHighValueScore(task) };
}

export function getScoreLabel(score: number): string {
  if (score >= 8) return "Elite leverage";
  if (score >= 6) return "High value";
  if (score >= 4) return "Good momentum";
  if (score >= 2) return "Useful";
  return "Low leverage";
}

export function sortByHighValueScore(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => calculateHighValueScore(b) - calculateHighValueScore(a));
}
