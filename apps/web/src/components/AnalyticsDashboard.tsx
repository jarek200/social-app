import {
  calculateAnalyticsMetrics,
  getRecentActivity,
  getTopPosts,
  getUserGrowthData,
} from "@services/analyticsService";
import type { JSX } from "preact";

export function AnalyticsDashboard(): JSX.Element {
  // Calculate analytics from real data
  const metrics = calculateAnalyticsMetrics();
  const topPosts = getTopPosts();
  const userGrowth = getUserGrowthData();
  const recentActivity = getRecentActivity();

  const maxValue = Math.max(...userGrowth.map((d) => d.value));

  const getTrendColor = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "text-emerald-400";
      case "down":
        return "text-rose-400";
      default:
        return "text-slate-400";
    }
  };

  const getTrendIcon = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "↗️";
      case "down":
        return "↘️";
      default:
        return "➡️";
    }
  };

  return (
    <div class="space-y-6">
      {/* Metrics Grid */}
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} class="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-400">{metric.label}</p>
                <p class="text-2xl font-bold text-white">{metric.value}</p>
              </div>
              <div class="text-2xl">{metric.icon}</div>
            </div>
            <div class={`mt-2 flex items-center gap-1 text-sm ${getTrendColor(metric.trend)}`}>
              <span>{getTrendIcon(metric.trend)}</span>
              <span>{metric.change}</span>
              <span class="text-slate-500">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div class="grid gap-6 lg:grid-cols-2">
        {/* User Growth Chart */}
        <div class="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
          <h3 class="text-lg font-semibold text-white mb-4">User Growth</h3>
          <div class="space-y-3">
            {userGrowth.map((data, _index) => (
              <div key={data.label} class="flex items-center gap-3">
                <div class="w-8 text-sm text-slate-400">{data.label}</div>
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <div class="flex-1 bg-slate-800 rounded-full h-2">
                      <div
                        class={`h-2 rounded-full ${data.color}`}
                        style={{ width: `${(data.value / maxValue) * 100}%` }}
                      />
                    </div>
                    <span class="text-sm text-white w-16 text-right">
                      {data.value.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Content */}
        <div class="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
          <h3 class="text-lg font-semibold text-white mb-4">Top Performing Posts</h3>
          <div class="space-y-4">
            {topPosts.map((post, index) => (
              <div key={post.id} class="flex items-center gap-4 p-3 rounded-xl bg-slate-800/50">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/20 text-brand-400 font-semibold text-sm">
                  {index + 1}
                </div>
                <div class="flex-1">
                  <p class="text-sm text-white line-clamp-2">{post.caption}</p>
                  <p class="text-xs text-slate-400">by {post.author}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm text-white">{post.likes} likes</p>
                  <p class="text-xs text-emerald-400">{post.engagement} engagement</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div class="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
        <h3 class="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div class="space-y-3">
          {recentActivity.map((activity) => (
            <div
              key={`activity-${activity.user}-${activity.time}`}
              class="flex items-center gap-4 p-3 rounded-xl bg-slate-800/30"
            >
              <div class="w-2 h-2 rounded-full bg-brand-500" />
              <div class="flex-1">
                <p class="text-sm text-white">
                  <span class="font-semibold text-brand-400">{activity.user}</span>{" "}
                  {activity.action}
                </p>
              </div>
              <span class="text-xs text-slate-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
