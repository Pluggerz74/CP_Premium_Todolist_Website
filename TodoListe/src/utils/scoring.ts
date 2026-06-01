import type { Task } from "../types/task";

export function calculateHighValueScore(task: Pick<Task, "impact" | "urgency" | "effort">): number {
  return task.impact + task.urgency - task.effort;
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
