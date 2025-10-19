import { useState, useEffect } from "preact/hooks";
import type { JSX } from "preact";
import { useStore } from "@nanostores/preact";
import { 
  realtimeOperations, 
  isConnectedStore, 
  connectionErrorStore,
  realtimeEventsStore 
} from "@services/realtimeService";

export function RealtimeControls(): JSX.Element {
  const [isRunning, setIsRunning] = useState(false);
  const [_stats, _setStats] = useState({
    posts: 0,
    likes: 0,
    comments: 0,
    messages: 0,
  });

  const isConnected = useStore(isConnectedStore);
  const connectionError = useStore(connectionErrorStore);
  const realtimeEvents = useStore(realtimeEventsStore);

  const handleToggleSimulation = () => {
    if (isConnected) {
      realtimeOperations.disconnect();
    } else {
      realtimeOperations.connectToFeed("GLOBAL");
    }
  };

  return (
    <div class="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <div class="flex items-center justify-between mb-3">
        <div>
          <h3 class="text-sm font-semibold text-white">Real-time Connection</h3>
          <p class="text-xs text-slate-400">
            {isConnected ? "Connected - Live updates active" : "Disconnected - Static demo data"}
          </p>
          {connectionError && (
            <p class="text-xs text-red-400 mt-1">Error: {connectionError}</p>
          )}
        </div>
        <button
          type="button"
          onClick={handleToggleSimulation}
          class={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            isConnected
              ? "bg-rose-500 text-white hover:bg-rose-400"
              : "bg-emerald-500 text-white hover:bg-emerald-400"
          }`}
        >
          {isConnected ? "Disconnect" : "Connect"}
        </button>
      </div>

      {isConnected && (
        <div class="space-y-2">
          <div class="text-xs text-slate-400">
            Recent events ({realtimeEvents.length})
          </div>
          <div class="max-h-32 overflow-y-auto space-y-1">
            {realtimeEvents.slice(0, 5).map((event, index) => (
              <div key={index} class="text-xs text-slate-300 bg-slate-800/30 rounded px-2 py-1">
                <span class="text-emerald-400">{event.type}</span> on post {event.postId.slice(-8)}
              </div>
            ))}
          </div>
        </div>
      )}

      <div class="mt-3 text-xs text-slate-500">
        {isConnected 
          ? "Connected to AppSync GraphQL subscriptions for real-time updates."
          : "Demo mode: Simulated real-time events for development."
        }
      </div>
    </div>
  );
}
