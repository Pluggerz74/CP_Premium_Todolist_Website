import type { TaskStatus, TaskType } from "../types/task";

export function formatStatusLabel(status: TaskStatus): string {
  if (status === "in-progress") return "In progress";
  if (status === "done") return "Done";
  return "To do";
}

export function formatTaskTypeLabel(type: TaskType): string {
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

export function getPriorityLabel(priority: number): string {
  if (priority >= 5) return "Critical";
  if (priority >= 4) return "High";
  if (priority >= 3) return "Medium";
  if (priority >= 2) return "Low";
  return "Minimal";
}
