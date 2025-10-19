
import { feedStore } from "@stores/feed";
import { listUsers } from "@stores/users";

export type AnalyticsMetric = {
  label: string;
  value: string | number;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: string;
};

export type TopPost = {
  id: string;
  caption: string;
  author: string;
  likes: number;
  comments: number;
  engagement: string;
};

export type ChartData = {
  label: string;
  value: number;
  color: string;
};

export type ActivityEvent = {
  time: string;
  action: string;
  user: string;
};

// Calculate analytics metrics from real data
export const calculateAnalyticsMetrics = (): AnalyticsMetric[] => {
  const feed = feedStore.get();
  const users = listUsers();

  // Calculate totals from real data
  const totalUsers = users.length;
  const activePosts = feed.length;
  const totalLikes = feed.reduce((sum, post) => sum + post.likes, 0);
  const totalComments = feed.reduce((sum, post) => sum + post.comments.length, 0);

  // Calculate average engagement (simplified)
  const avgEngagement =
    activePosts > 0 ? `${((totalLikes + totalComments) / (activePosts * 100)).toFixed(1)}%` : "0%";

  // Count pending moderation
  const pendingModeration = feed.filter((post) => post.moderationStatus === "PENDING").length;

  return [
    {
      label: "Total Users",
      value: totalUsers.toLocaleString(),
      change: "+12.5%", // Mock change - would come from historical data
      trend: "up",
      icon: "👥",
    },
    {
      label: "Active Posts",
      value: activePosts.toLocaleString(),
      change: "+8.2%", // Mock change
      trend: "up",
      icon: "📝",
    },
    {
      label: "Total Likes",
      value: totalLikes.toLocaleString(),
      change: "+15.3%", // Mock change
      trend: "up",
      icon: "❤️",
    },
    {
      label: "Comments",
      value: totalComments.toLocaleString(),
      change: "+22.1%", // Mock change
      trend: "up",
      icon: "💬",
    },
    {
      label: "Avg. Engagement",
      value: avgEngagement,
      change: "-2.1%", // Mock change
      trend: "down",
      icon: "📊",
    },
    {
      label: "Moderation Queue",
      value: pendingModeration.toString(),
      change: `+${Math.max(0, pendingModeration - 18)}`, // Mock change
      trend: pendingModeration > 20 ? "up" : "neutral",
      icon: "⚖️",
    },
  ];
};

// Get top performing posts from real data
export const getTopPosts = (): TopPost[] => {
  const feed = feedStore.get();

  return feed
    .sort((a, b) => b.likes + b.comments.length - (a.likes + a.comments.length))
    .slice(0, 3)
    .map((post, _index) => ({
      id: post.id,
      caption: post.caption.length > 50 ? `${post.caption.slice(0, 50)}...` : post.caption,
      author: post.authorName,
      likes: post.likes,
      comments: post.comments.length,
      engagement: `${(((post.likes + post.comments.length) / 100) * 100).toFixed(1)}%`,
    }));
};

// Generate user growth chart data (mock for now)
export const getUserGrowthData = (): ChartData[] => {
  const users = listUsers();
  const currentUsers = users.length;

  // Generate mock historical data based on current users
  const baseValue = Math.max(100, Math.floor(currentUsers * 0.3));

  return [
    { label: "Jan", value: baseValue, color: "bg-blue-500" },
    { label: "Feb", value: Math.floor(baseValue * 1.1), color: "bg-blue-500" },
    { label: "Mar", value: Math.floor(baseValue * 1.3), color: "bg-blue-500" },
    { label: "Apr", value: Math.floor(baseValue * 1.5), color: "bg-blue-500" },
    { label: "May", value: Math.floor(baseValue * 1.7), color: "bg-blue-500" },
    { label: "Jun", value: currentUsers, color: "bg-blue-500" },
  ];
};

// Generate recent activity events (mock for now)
export const getRecentActivity = (): ActivityEvent[] => {
  const feed = feedStore.get();
  const users = listUsers();

  // Generate mock activity based on recent posts
  const activities: ActivityEvent[] = [];

  feed.slice(0, 3).forEach((post, index) => {
    activities.push({
      time: `${(index + 1) * 5}m ago`,
      action: "New post created",
      user: post.authorName,
    });
  });

  // Add some mock activities
  activities.push(
    {
      time: "12m ago",
      action: "New comment on post",
      user: users[Math.floor(Math.random() * users.length)]?.displayName || "Unknown User",
    },
    {
      time: "18m ago",
      action: "User followed",
      user: users[Math.floor(Math.random() * users.length)]?.displayName || "Unknown User",
    },
  );

  return activities.slice(0, 5);
};

// Get real-time metrics for dashboard
export const getRealtimeMetrics = () => {
  const feed = feedStore.get();
  const _users = listUsers();

  return {
    activeViewers: Math.floor(Math.random() * 2000) + 1000, // Mock real-time data
    liveSubscriptions: Math.floor(Math.random() * 500) + 200,
    pendingModeration: feed.filter((post) => post.moderationStatus === "PENDING").length,
    stepFnThroughput: Math.floor(Math.random() * 20) + 50,
  };
};
