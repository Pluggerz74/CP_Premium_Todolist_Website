export type StorageWriteResult =
  | { ok: true }
  | { ok: false; error: string; quotaExceeded: boolean };

export type StorageReadResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export interface StorageProvider {
  readRaw(key: string): StorageReadResult<string | null>;
  writeRaw(key: string, value: string): StorageWriteResult;
  remove(key: string): void;
  getKeys(prefix: string): string[];
}

export class LocalStorageProvider implements StorageProvider {
  readRaw(key: string): StorageReadResult<string | null> {
    try {
      return { ok: true, value: window.localStorage.getItem(key) };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : "Storage read failed" };
    }
  }

  writeRaw(key: string, value: string): StorageWriteResult {
    try {
      window.localStorage.setItem(key, value);
      return { ok: true };
    } catch (error) {
      const quotaExceeded =
        error instanceof DOMException &&
        (error.code === 22 || error.code === 1014 || error.name === "QuotaExceededError");
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Storage write failed",
        quotaExceeded,
      };
    }
  }

  remove(key: string): void {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore remove failures — data may already be gone.
    }
  }

  getKeys(prefix: string): string[] {
    const keys: string[] = [];
    try {
      for (let index = 0; index < window.localStorage.length; index += 1) {
        const key = window.localStorage.key(index);
        if (key?.startsWith(prefix)) keys.push(key);
      }
    } catch {
      return keys;
    }
    return keys;
  }
}

let activeProvider: StorageProvider = new LocalStorageProvider();

export function getStorageProvider(): StorageProvider {
  return activeProvider;
}

export function setStorageProvider(provider: StorageProvider): void {
  activeProvider = provider;
}
