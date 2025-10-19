import { useEffect } from "preact/hooks";
import { initializeAuth } from "@services/auth";
import { initializeData, cleanupData } from "@services/dataService";

export function AppInitializer() {
  useEffect(() => {
    // Initialize Amplify configuration
    const initApp = async () => {
      try {
        // Initialize authentication
        await initializeAuth();

        // Initialize data services
        await initializeData();

        console.log("✅ App initialized successfully");
      } catch (error) {
        console.error("❌ App initialization failed:", error);
      }
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
