import type { ChangeEvent } from "react";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectFieldProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  "aria-label"?: string;
  id?: string;
  className?: string;
};

export function SelectField({
  value,
  onChange,
  options,
  disabled,
  "aria-label": ariaLabel,
  id,
  className,
}: SelectFieldProps) {
  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    onChange(event.target.value);
  }

  return (
    <select
      id={id}
      className={className ? `select-field ${className}` : "select-field"}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {options.map((option) => (
        <option key={`${option.value}-${option.label}`} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
