export function readStorage<T>(key: string, fallback: T, migrate?: (value: unknown) => T): T {
  try {
    const rawValue = window.localStorage.getItem(key);
    if (!rawValue) return fallback;
    const parsed = JSON.parse(rawValue) as unknown;
    return migrate ? migrate(parsed) : (parsed as T);
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorage(key: string): void {
  window.localStorage.removeItem(key);
}
