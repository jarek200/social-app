type UserProfile = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  followers: number;
  following: number;
  followingIds: string[]; // IDs of users this user follows
  followerIds: string[]; // IDs of users following this user
  posts: number;
  role: "admin" | "user";
};

// Empty initial state - data loaded from backend or demo mode
const users: UserProfile[] = [];

export const findUserByUsername = (username: string) =>
  users.find((user) => user.username.toLowerCase() === username.toLowerCase());

export const listUsers = () => users;

// Helper functions for role checking
export const isAdmin = (userId: string) => {
  const user = users.find((u) => u.id === userId);
  return user?.role === "admin";
};

export const isUser = (userId: string) => {
  const user = users.find((u) => u.id === userId);
  return user?.role === "user";
};

export const getAdmins = () => users.filter((user) => user.role === "admin");

// Following system functions
export const isFollowing = (followerId: string, targetId: string) => {
  const user = users.find((u) => u.id === followerId);
  return user?.followingIds.includes(targetId) ?? false;
};

export const followUser = (followerId: string, targetId: string) => {
  const follower = users.find((u) => u.id === followerId);
  const target = users.find((u) => u.id === targetId);

  if (!follower || !target || followerId === targetId) return false;

  // Add to follower's following list
  if (!follower.followingIds.includes(targetId)) {
    follower.followingIds.push(targetId);
    follower.following++;
  }

  // Add to target's followers list
  if (!target.followerIds.includes(followerId)) {
    target.followerIds.push(followerId);
    target.followers++;
  }

  return true;
};

export const unfollowUser = (followerId: string, targetId: string) => {
  const follower = users.find((u) => u.id === followerId);
  const target = users.find((u) => u.id === targetId);

  if (!follower || !target) return false;

  // Remove from follower's following list
  const followingIndex = follower.followingIds.indexOf(targetId);
  if (followingIndex > -1) {
    follower.followingIds.splice(followingIndex, 1);
    follower.following = Math.max(0, follower.following - 1);
  }

  // Remove from target's followers list
  const followerIndex = target.followerIds.indexOf(followerId);
  if (followerIndex > -1) {
    target.followerIds.splice(followerIndex, 1);
    target.followers = Math.max(0, target.followers - 1);
  }

  return true;
};

export const getFollowingUsers = (userId: string) => {
  const user = users.find((u) => u.id === userId);
  if (!user) return [];
  return user.followingIds
    .map((id) => users.find((u) => u.id === id))
    .filter((u): u is UserProfile => u !== undefined);
};

export const getFollowerUsers = (userId: string) => {
  const user = users.find((u) => u.id === userId);
  if (!user) return [];
  return user.followerIds
    .map((id) => users.find((u) => u.id === id))
    .filter((u): u is UserProfile => u !== undefined);
};

// Search functionality
export const searchUsers = (query: string) => {
  if (!query.trim()) return users;

  const lowercaseQuery = query.toLowerCase();
  return users.filter(
    (user) =>
      user.displayName.toLowerCase().includes(lowercaseQuery) ||
      user.username.toLowerCase().includes(lowercaseQuery) ||
      user.bio.toLowerCase().includes(lowercaseQuery),
  );
};
