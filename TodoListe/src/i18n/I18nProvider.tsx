import { createContext, useEffect, useMemo, type ReactNode } from "react";
import type { Language } from "./translations";
import { translate, type TranslationKey } from "./translations";

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
};

export const I18nContext = createContext<I18nContextValue | null>(null);

type I18nProviderProps = {
  language: Language;
  setLanguage: (language: Language) => void;
  children: ReactNode;
};

export function I18nProvider({ language, setLanguage, children }: I18nProviderProps) {
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key) => translate(language, key),
    }),
    [language, setLanguage],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
