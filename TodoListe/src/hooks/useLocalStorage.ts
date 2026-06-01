import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { readStorage, writeStorage } from "../utils/storage";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  migrate?: (value: unknown) => T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const raw = readStorage<unknown | null>(key, null);
    if (raw === null) return initialValue;
    return migrate ? migrate(raw) : (raw as T);
  });

  useEffect(() => {
    writeStorage(key, value);
  }, [key, value]);

  return [value, setValue];
}
