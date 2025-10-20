import { useEffect, useState } from "preact/hooks";
import { getNotificationSnapshot } from "@stores/notifications";

export function NotificationList() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Check for demo mode
  const isDemoMode =
    import.meta.env.PUBLIC_DEMO_MODE === "true" || !import.meta.env.PUBLIC_APPSYNC_URL;

  useEffect(() => {
    const loadNotifications = async () => {
      if (isDemoMode) {
        // Use demo data
        setNotifications(getNotificationSnapshot());
      } else {
        // In production, fetch from AppSync
        // TODO: Implement real notification fetching
        setNotifications([]);
      }
      setLoading(false);
    };

    loadNotifications();
  }, [isDemoMode]);

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  if (loading) {
    return (
      <div class="flex items-center justify-center p-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <section class="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
      <header class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-semibold text-white">Notifications</h1>
          <p class="text-sm text-slate-400">Live updates from followers, likes, and comments.</p>
        </div>
        <span class="rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-100">
          {unreadCount} unread
        </span>
      </header>
      <ul class="mt-6 space-y-3 text-sm text-slate-200">
        {notifications.map((notif) => (
          <li
            key={notif.id}
            class={`flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 ${
              notif.read ? "bg-slate-900/50" : "bg-brand-500/10"
            }`}
          >
            <div>
              <p class="font-semibold text-white">{notif.actor}</p>
              <p class="text-slate-300">{notif.message}</p>
            </div>
            <span class="text-xs text-slate-500">{new Date(notif.createdAt).toLocaleTimeString()}</span>
          </li>
        ))}
        {notifications.length === 0 && (
          <li class="text-center text-slate-400 py-8">No notifications yet.</li>
        )}
      </ul>
    </section>
  );
}

