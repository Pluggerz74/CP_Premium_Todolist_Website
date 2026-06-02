export function getTodayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isToday(date: string): boolean {
  return date === getTodayIsoDate();
}

export function isUpcoming(date: string): boolean {
  return date > getTodayIsoDate();
}

export function isOverdue(date: string): boolean {
  return date < getTodayIsoDate();
}

export type DueDateTone = "overdue" | "today" | "upcoming" | "none";

export function getDueDateTone(date: string): DueDateTone {
  if (!date) return "none";
  if (isOverdue(date)) return "overdue";
  if (isToday(date)) return "today";
  if (isUpcoming(date)) return "upcoming";
  return "none";
}

export function formatDateLabel(date: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}
