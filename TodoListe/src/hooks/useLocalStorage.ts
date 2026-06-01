import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { readStorage, serializeStorageValue, writeStorage } from "../utils/storage";
import { recordStorageError, recordStorageSuccess } from "../utils/storageMigration";

const WRITE_DEBOUNCE_MS = 300;

export type StorageHookState = {
  writeError: string | null;
  quotaExceeded: boolean;
};

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  migrate?: (value: unknown) => T,
): [T, Dispatch<SetStateAction<T>>, StorageHookState] {
  const [value, setValue] = useState<T>(() => {
    const raw = readStorage<unknown | null>(key, null);
    if (raw === null) return initialValue;
    return migrate ? migrate(raw) : (raw as T);
  });

  const [storageState, setStorageState] = useState<StorageHookState>({
    writeError: null,
    quotaExceeded: false,
  });

  const lastPersistedRef = useRef<string>(serializeStorageValue(value));
  const debounceRef = useRef<number | null>(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      lastPersistedRef.current = serializeStorageValue(value);
      return;
    }

    const serialized = serializeStorageValue(value);
    if (serialized === lastPersistedRef.current) {
      return;
    }

    if (debounceRef.current !== null) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      if (serializeStorageValue(value) === lastPersistedRef.current) return;

      const result = writeStorage(key, value);
      if (result.ok) {
        lastPersistedRef.current = serializeStorageValue(value);
        recordStorageSuccess();
        setStorageState({ writeError: null, quotaExceeded: false });
      } else {
        recordStorageError(result.error);
        setStorageState({ writeError: result.error, quotaExceeded: result.quotaExceeded });
      }
    }, WRITE_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current !== null) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [key, value]);

  return [value, setValue, storageState];
}
