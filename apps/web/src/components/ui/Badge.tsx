import type { JSX } from "preact";

export type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

interface BadgeProps {
  children: JSX.Element | string;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  class?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30",
  warning: "bg-amber-500/10 text-amber-300 border border-amber-500/30",
  danger: "bg-rose-500/10 text-rose-300 border border-rose-500/30",
  info: "bg-blue-500/10 text-blue-300 border border-blue-500/30",
  neutral: "bg-slate-500/10 text-slate-300 border border-slate-500/30",
};

const sizeClasses = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1 text-sm",
};

export function Badge({
  children,
  variant = "neutral",
  size = "md",
  class: className = "",
}: BadgeProps): JSX.Element {
  const baseClasses = "rounded-full font-semibold";
  const variantClass = variantClasses[variant];
  const sizeClass = sizeClasses[size];
  const combinedClasses = `${baseClasses} ${variantClass} ${sizeClass} ${className}`.trim();

  return <span class={combinedClasses}>{children}</span>;
}
