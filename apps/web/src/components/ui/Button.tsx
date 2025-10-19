import type { JSX } from "preact";

export type ButtonVariant = "primary" | "secondary" | "danger" | "success" | "warning";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: JSX.Element | string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  class?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand-500 text-white hover:bg-brand-400",
  secondary: "border border-white/20 text-white hover:border-brand-400 hover:text-brand-200",
  danger: "bg-red-500 text-white hover:bg-red-400",
  success: "bg-emerald-500 text-white hover:bg-emerald-400",
  warning: "bg-amber-500 text-white hover:bg-amber-400",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  class: className = "",
}: ButtonProps): JSX.Element {
  const baseClasses =
    "rounded-full font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClass = variantClasses[variant];
  const sizeClass = sizeClasses[size];

  const combinedClasses = `${baseClasses} ${variantClass} ${sizeClass} ${className}`.trim();

  return (
    <button type={type} disabled={disabled || loading} onClick={onClick} class={combinedClasses}>
      {loading ? "Loading..." : children}
    </button>
  );
}
