import { getStorageProvider, type StorageWriteResult } from "./storageProvider";

export type { StorageWriteResult };

export function serializeStorageValue<T>(value: T): string {
  return JSON.stringify(value);
}

export function readStorage<T>(key: string, fallback: T, migrate?: (value: unknown) => T): T {
  const provider = getStorageProvider();
  const result = provider.readRaw(key);

  if (!result.ok) {
    console.warn(`[storage] Failed to read "${key}": ${result.error}`);
    return fallback;
  }

  if (result.value === null) return fallback;

  try {
    const parsed = JSON.parse(result.value) as unknown;
    return migrate ? migrate(parsed) : (parsed as T);
  } catch {
    console.warn(`[storage] Corrupted JSON for "${key}" — using fallback`);
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): StorageWriteResult {
  const provider = getStorageProvider();
  try {
    return provider.writeRaw(key, serializeStorageValue(value));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Storage write failed";
    console.warn(`[storage] Failed to write "${key}": ${message}`);
    return { ok: false, error: message, quotaExceeded: false };
  }
}

export function removeStorage(key: string): void {
  getStorageProvider().remove(key);
}

export function isStorageValueEqual<T>(left: T, right: T): boolean {
  return serializeStorageValue(left) === serializeStorageValue(right);
}
