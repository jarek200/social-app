import type { JSX } from "preact";

interface InputProps {
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  onInput?: (e: Event) => void;
  onChange?: (e: Event) => void;
  class?: string;
  id?: string;
  name?: string;
}

export function Input({
  type = "text",
  placeholder,
  value,
  disabled = false,
  required = false,
  onInput,
  onChange,
  class: className = "",
  id,
  name,
}: InputProps): JSX.Element {
  const baseClasses =
    "rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40";
  const combinedClasses = `${baseClasses} ${className}`.trim();

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      required={required}
      onInput={onInput}
      onChange={onChange}
      class={combinedClasses}
      id={id}
      name={name}
    />
  );
}
