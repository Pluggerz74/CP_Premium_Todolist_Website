import { translate, type Language, type TranslationKey } from "./translations";

export function translateBackupError(language: Language, error: string): string {
  const map: Record<string, TranslationKey> = {
    "Invalid JSON file": "backup.error.invalidJson",
    "Invalid backup format": "backup.error.invalidFormat",
    "Backup is missing required collections": "backup.error.missingCollections",
    "Backup hierarchy is invalid": "backup.error.invalidHierarchy",
  };
  const key = map[error];
  return key ? translate(language, key) : error;
}

export type { Language, TranslationKey };
