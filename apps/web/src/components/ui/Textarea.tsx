import type { JSX } from "preact";

interface TextareaProps {
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  onInput?: (e: Event) => void;
  onChange?: (e: Event) => void;
  class?: string;
  id?: string;
  name?: string;
}

export function Textarea({
  placeholder,
  value,
  disabled = false,
  required = false,
  rows = 3,
  onInput,
  onChange,
  class: className = "",
  id,
  name,
}: TextareaProps): JSX.Element {
  const baseClasses =
    "rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40";
  const combinedClasses = `${baseClasses} ${className}`.trim();

  return (
    <textarea
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      required={required}
      rows={rows}
      onInput={onInput}
      onChange={onChange}
      class={combinedClasses}
      id={id}
      name={name}
    />
  );
}
