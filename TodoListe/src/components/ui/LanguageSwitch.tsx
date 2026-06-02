import type { Language } from "../../i18n/translations";
import { useI18n } from "../../i18n/useI18n";

type LanguageSwitchProps = {
  variant?: "compact" | "settings";
};

export function LanguageSwitch({ variant = "settings" }: LanguageSwitchProps) {
  const { language, setLanguage, t } = useI18n();

  const options: Array<{ value: Language; label: string }> = [
    { value: "en", label: t("lang.en") },
    { value: "de", label: t("lang.de") },
  ];

  return (
    <div
      className={variant === "compact" ? "language-switch language-switch--compact" : "language-switch"}
      role="group"
      aria-label={t("settings.language")}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={language === option.value ? "language-switch__btn is-active" : "language-switch__btn"}
          onClick={() => setLanguage(option.value)}
          aria-pressed={language === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
