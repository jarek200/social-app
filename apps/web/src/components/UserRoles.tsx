import { useEffect, useState } from "preact/hooks";
import { getAdmins, isAdmin, listUsers } from "@stores/users";

export function UserRoles() {
  const currentUserId = "user-2"; // Demo admin
  const [userIsAdmin] = useState(isAdmin(currentUserId));
  const [admins] = useState(getAdmins());
  const [allUsers] = useState(listUsers());

  // Check for demo mode
  const isDemoMode =
    import.meta.env.PUBLIC_DEMO_MODE === "true" || !import.meta.env.PUBLIC_APPSYNC_URL;

  // Don't show this component if not in demo mode
  if (!isDemoMode) {
    return null;
  }

  return (
    <section class="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
      <header class="mb-4">
        <h2 class="text-lg font-semibold text-white">👥 User Roles Demo</h2>
        <p class="text-sm text-slate-400">
          Currently logged in as:
          <span class={`font-semibold ${userIsAdmin ? "text-amber-400" : "text-blue-400"}`}>
            {userIsAdmin ? " Admin User" : " Regular User"}
          </span>
        </p>
      </header>
      <div class="grid gap-4 md:grid-cols-2">
        <div class="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <h3 class="text-sm font-semibold text-white mb-2">Admin Users ({admins.length})</h3>
          <ul class="space-y-2">
            {admins.map((admin) => (
              <li key={admin.id} class="flex items-center gap-2 text-sm">
                <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                <span class="text-slate-300">{admin.displayName}</span>
                <span class="text-xs text-slate-500">@{admin.username}</span>
              </li>
            ))}
          </ul>
        </div>
        <div class="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <h3 class="text-sm font-semibold text-white mb-2">All Users ({allUsers.length})</h3>
          <ul class="space-y-2">
            {allUsers.map((user) => (
              <li key={user.id} class="flex items-center gap-2 text-sm">
                <span class={`w-2 h-2 rounded-full ${user.role === "admin" ? "bg-amber-400" : "bg-blue-400"}`}></span>
                <span class="text-slate-300">{user.displayName}</span>
                <span class="text-xs text-slate-500">({user.role})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {userIsAdmin && (
        <div class="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
          <p class="text-sm text-amber-200">
            🔧 <strong>Admin Privileges:</strong> You can access the moderation console and manage content.
            Only admin users see the "Admin" link in the navigation.
          </p>
        </div>
      )}
    </section>
  );
}

