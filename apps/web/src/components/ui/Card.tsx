import type { JSX } from "preact";

interface CardProps {
  children: JSX.Element | JSX.Element[];
  padding?: "sm" | "md" | "lg";
  class?: string;
}

const paddingClasses = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({ children, padding = "md", class: className = "" }: CardProps): JSX.Element {
  const baseClasses = "rounded-2xl border border-white/10 bg-slate-900/70";
  const paddingClass = paddingClasses[padding];
  const combinedClasses = `${baseClasses} ${paddingClass} ${className}`.trim();

  return <div class={combinedClasses}>{children}</div>;
}
