type UserProfile = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  role: "admin" | "user"; // Add role field
};

const users: UserProfile[] = [
  {
    id: "user-1",
    username: "ava",
    displayName: "Ava Martinez",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
    bio: "Product + ops, building resilient social pipelines.",
    followers: 1203,
    following: 342,
    posts: 58,
    role: "user",
  },
  {
    id: "user-2",
    username: "noah",
    displayName: "Noah Chen",
    avatarUrl: "https://i.pravatar.cc/150?img=15",
    bio: "SRE with a camera. Watching dashboards + sunsets.",
    followers: 987,
    following: 421,
    posts: 44,
    role: "admin", // Make Noah an admin
  },
  {
    id: "user-3",
    username: "priya",
    displayName: "Priya Patel",
    avatarUrl: "https://i.pravatar.cc/150?img=32",
    bio: "Automation engineer. Shipping workflows faster than light.",
    followers: 1643,
    following: 289,
    posts: 72,
    role: "user",
  },
];

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
