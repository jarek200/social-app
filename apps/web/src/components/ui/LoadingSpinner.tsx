import type { JSX } from "preact";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  class?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function LoadingSpinner({
  size = "md",
  class: className = "",
}: LoadingSpinnerProps): JSX.Element {
  const sizeClass = sizeClasses[size];
  const combinedClasses = `${sizeClass} ${className}`.trim();

  return (
    <div
      class={`animate-spin rounded-full border-2 border-slate-300 border-t-brand-500 ${combinedClasses}`}
    />
  );
}
