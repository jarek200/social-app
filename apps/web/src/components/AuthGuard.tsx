import { authStore } from "@services/auth";
import type { ComponentChildren } from "preact";
import { useEffect, useState } from "preact/hooks";

interface AuthGuardProps {
  children?: ComponentChildren;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [authState, setAuthState] = useState(authStore.get());

  useEffect(() => {
    // Subscribe to auth changes
    const unsubscribe = authStore.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  // Check for demo mode - only enable if explicitly set
  const isDemoMode = import.meta.env.PUBLIC_DEMO_MODE === "true";

  // If demo mode is enabled, allow access
  if (isDemoMode) {
    return <>{children}</>;
  }

  // Show loading state while checking auth
  if (authState.isLoading) {
    return (
      <div class="flex min-h-screen items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <p class="text-slate-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to auth page
  if (!authState.isAuthenticated) {
    if (typeof window !== "undefined") {
      window.location.href = "/auth";
    }
    return null;
  }

  // If authenticated, render children
  return <>{children}</>;
}
