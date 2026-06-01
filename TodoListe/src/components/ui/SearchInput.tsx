type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variant?: "default" | "toolbar";
};

export function SearchInput({
  value,
  onChange,
  placeholder = "Search tasks...",
  variant = "default",
}: SearchInputProps) {
  return (
    <label className={variant === "toolbar" ? "search-input search-input--toolbar" : "search-input"}>
      <span className="search-input__icon" aria-hidden="true">
        ⌕
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search tasks"
      />
    </label>
  );
}
