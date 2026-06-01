export function getTodayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isToday(date: string): boolean {
  return date === getTodayIsoDate();
}

export function isUpcoming(date: string): boolean {
  return date > getTodayIsoDate();
}

export function formatDateLabel(date: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}
