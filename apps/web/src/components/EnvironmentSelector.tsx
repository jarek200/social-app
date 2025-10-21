import { type Environment, getEnvironmentConfig } from "@utils/environment";
import { useState } from "preact/hooks";

interface EnvironmentSelectorProps {
  onEnvironmentChange?: (environment: Environment) => void;
}

export function EnvironmentSelector({ onEnvironmentChange }: EnvironmentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const envConfig = getEnvironmentConfig();

  const environments: { value: Environment; label: string; description: string }[] = [
    { value: "development", label: "Development", description: "Local development" },
    { value: "sandbox", label: "Sandbox", description: "Amplify sandbox" },
    { value: "staging", label: "Staging", description: "Pre-production testing" },
    { value: "production", label: "Production", description: "Live environment" },
  ];

  const handleEnvironmentChange = (environment: Environment) => {
    // In a real app, you might want to reload the page or update configuration
    if (onEnvironmentChange) {
      onEnvironmentChange(environment);
    }
    setIsOpen(false);
  };

  // Only show in development/sandbox environments
  if (envConfig.isProduction) {
    return null;
  }

  return (
    <div class="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        class="flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700"
      >
        <span class="text-xs font-medium uppercase tracking-wide">{envConfig.environment}</span>
        <svg
          class={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <title>Toggle environment selector</title>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div class="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-slate-600 bg-slate-800 shadow-lg">
          <div class="p-3">
            <h3 class="text-sm font-medium text-slate-200">Environment Info</h3>
            <div class="mt-2 space-y-1 text-xs text-slate-400">
              <div>
                Current: <span class="text-slate-300">{envConfig.environment}</span>
              </div>
              <div>
                Region: <span class="text-slate-300">{envConfig.region}</span>
              </div>
              <div>
                Demo Mode: <span class="text-slate-300">{envConfig.demoMode ? "Yes" : "No"}</span>
              </div>
              <div>
                Debug Mode: <span class="text-slate-300">{envConfig.debugMode ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>

          <div class="border-t border-slate-600 p-2">
            <h4 class="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
              Available Environments
            </h4>
            <div class="space-y-1">
              {environments.map((env) => (
                <button
                  key={env.value}
                  type="button"
                  onClick={() => handleEnvironmentChange(env.value)}
                  class={`w-full rounded px-3 py-2 text-left text-xs transition-colors ${
                    env.value === envConfig.environment
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <div class="font-medium">{env.label}</div>
                  <div class="text-slate-400">{env.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div class="border-t border-slate-600 p-3">
            <h4 class="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
              Features
            </h4>
            <div class="space-y-1 text-xs">
              {Object.entries(envConfig.features).map(([key, enabled]) => (
                <div key={key} class="flex items-center justify-between">
                  <span class="text-slate-300 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                  <span
                    class={`px-2 py-1 rounded text-xs ${
                      enabled ? "bg-green-600 text-white" : "bg-slate-600 text-slate-300"
                    }`}
                  >
                    {enabled ? "ON" : "OFF"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
