import { useEffect } from "preact/hooks";
import "@config/amplify";
import { initializeAuth } from "@services/auth";
import { cleanupData, initializeData } from "@services/dataService";

export function AppInitializer() {
  useEffect(() => {
    // Initialize Amplify configuration
    const initApp = async () => {
      try {
        // Initialize authentication
        await initializeAuth();

        // Initialize data services
        await initializeData();
      } catch (error) {}
    };

    initApp();

    // Cleanup on unmount
    return () => {
      cleanupData();
    };
  }, []);

  // This component doesn't render anything
  return null;
}
