import { useState, useEffect } from "preact/hooks";
import type { JSX } from "preact";
import { requestNotificationPermission } from "@utils/notifications";

export function NotificationPermissions(): JSX.Element {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check current permission status
    if ("Notification" in window) {
      setPermission(Notification.permission);
    } else {
      setPermission("denied");
    }
  }, []);

  const handleRequestPermission = async () => {
    setIsLoading(true);
    const newPermission = await requestNotificationPermission();
    setPermission(newPermission);
    setIsLoading(false);
  };

  const getStatusMessage = () => {
    switch (permission) {
      case "granted":
        return {
          message:
            "Notifications enabled! You'll be notified about new posts, likes, and comments.",
          type: "success" as const,
        };
      case "denied":
        return {
          message:
            "Notifications are blocked. Enable them in your browser settings to stay updated.",
          type: "error" as const,
        };
      default:
        return {
          message: "Enable notifications to get real-time updates about your social activity.",
          type: "info" as const,
        };
    }
  };

  const status = getStatusMessage();

  return (
    <div class="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <h3 class="text-sm font-semibold text-white mb-1">Browser Notifications</h3>
          <p
            class={`text-sm ${status.type === "success" ? "text-emerald-300" : status.type === "error" ? "text-rose-300" : "text-slate-300"}`}
          >
            {status.message}
          </p>
        </div>
        {permission !== "granted" && (
          <button
            type="button"
            onClick={handleRequestPermission}
            disabled={isLoading || permission === "denied"}
            class={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              permission === "denied"
                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-brand-500 text-white hover:bg-brand-400"
            }`}
          >
            {isLoading ? "Requesting..." : permission === "denied" ? "Blocked" : "Enable"}
          </button>
        )}
      </div>

      {permission === "granted" && (
        <div class="mt-3 flex flex-wrap gap-2 text-xs">
          <span class="rounded-full bg-emerald-500/20 px-2 py-1 text-emerald-300">New posts</span>
          <span class="rounded-full bg-emerald-500/20 px-2 py-1 text-emerald-300">Likes</span>
          <span class="rounded-full bg-emerald-500/20 px-2 py-1 text-emerald-300">Comments</span>
          <span class="rounded-full bg-emerald-500/20 px-2 py-1 text-emerald-300">Followers</span>
        </div>
      )}
    </div>
  );
}
