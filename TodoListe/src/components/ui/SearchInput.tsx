import type { Ref } from "react";
import { useI18n } from "../../i18n/useI18n";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variant?: "default" | "toolbar";
  inputRef?: Ref<HTMLInputElement>;
};

export function SearchInput({
  value,
  onChange,
  placeholder,
  variant = "default",
  inputRef,
}: SearchInputProps) {
  const { t } = useI18n();
  const resolvedPlaceholder = placeholder ?? t("label.search");

  return (
    <label className={variant === "toolbar" ? "search-input search-input--toolbar" : "search-input"}>
      <span className="search-input__icon" aria-hidden="true">
        ⌕
      </span>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={resolvedPlaceholder}
        aria-label={resolvedPlaceholder}
      />
    </label>
  );
}
