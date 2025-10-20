import { authStore, signOutUser } from "@services/auth";
import { cleanupData } from "@services/dataService";
import { useState } from "preact/hooks";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const authState = authStore.get();

  const handleLogout = async () => {
    if (!confirm("Are you sure you want to sign out?")) {
      return;
    }

    setIsLoading(true);
    try {
      // Clear auth state
      await signOutUser();

      // Clean up data stores
      cleanupData();

      // Redirect to auth page
      window.location.href = "/auth";
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Sign out failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check for demo mode from environment
  const isDemoMode = import.meta.env.PUBLIC_DEMO_MODE === "true";

  if (!authState.isAuthenticated && !isDemoMode) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      class="rounded-full border border-red-500/30 px-4 py-2 font-medium text-red-300 transition hover:border-red-400 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? "Signing out..." : "Sign Out"}
    </button>
  );
}
