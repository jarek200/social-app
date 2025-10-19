import type { JSX } from "preact";

export type AlertVariant = "success" | "warning" | "danger" | "info";

interface AlertProps {
  children: JSX.Element | string;
  variant?: AlertVariant;
  class?: string;
}

const variantClasses: Record<AlertVariant, string> = {
  success: "border-green-500/30 bg-green-500/10 text-green-200",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  danger: "border-red-500/30 bg-red-500/10 text-red-200",
  info: "border-blue-500/30 bg-blue-500/10 text-blue-200",
};

const icons: Record<AlertVariant, string> = {
  success: "✅",
  warning: "⚠️",
  danger: "❌",
  info: "ℹ️",
};

export function Alert({
  children,
  variant = "info",
  class: className = "",
}: AlertProps): JSX.Element {
  const baseClasses = "rounded-xl border p-3";
  const variantClass = variantClasses[variant];
  const combinedClasses = `${baseClasses} ${variantClass} ${className}`.trim();

  return (
    <div class={combinedClasses}>
      <p class="text-sm">
        <span class="mr-2">{icons[variant]}</span>
        {children}
      </p>
    </div>
  );
}
