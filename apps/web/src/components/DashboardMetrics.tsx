import { useEffect, useState } from "preact/hooks";
import { postsStore } from "@services/dataService";
import { getRealtimeMetrics } from "@services/analyticsService";

export function DashboardMetrics() {
  const [posts, setPosts] = useState(postsStore.get());
  const [metrics, setMetrics] = useState(getRealtimeMetrics());

  useEffect(() => {
    // Subscribe to posts store
    const unsubscribePosts = postsStore.subscribe(setPosts);
    
    // Update metrics periodically
    const interval = setInterval(() => {
      setMetrics(getRealtimeMetrics());
    }, 5000);

    return () => {
      unsubscribePosts();
      clearInterval(interval);
    };
  }, []);

  const metricsData = [
    { label: "New posts", value: posts.length.toString(), delta: "+18%" },
    { label: "Active sessions", value: metrics.activeViewers.toLocaleString(), delta: "+6%" },
    { label: "Workflow latency", value: "1.8s", delta: "p95" },
    { label: "Alerts", value: metrics.pendingModeration.toString(), delta: "open" },
  ];

  return (
    <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {metricsData.map((metric) => (
        <li key={metric.label} class="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3">
          <p class="text-xs uppercase tracking-wide text-slate-400">{metric.label}</p>
          <p class="text-2xl font-bold text-white">{metric.value}</p>
          <p class="text-xs text-emerald-300">{metric.delta}</p>
        </li>
      ))}
    </ul>
  );
}

