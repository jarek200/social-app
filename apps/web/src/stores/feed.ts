import { atom, computed } from "nanostores";
import { getFollowingUsers } from "./users";

export type FeedItem = {
  id: string;
  authorId: string;
  authorName: string;
  caption: string;
  imageUrl: string;
  likes: number;
  likedByViewer: boolean;
  createdAt: string;
  moderationStatus: "APPROVED" | "PENDING" | "REJECTED";
  comments: Array<{
    id: string;
    authorId: string;
    authorName: string;
    text: string;
    createdAt: string;
  }>;
};

// Seed with demo data to highlight real-time UX without requiring a backend connected yet.
const seedItems: FeedItem[] = [
  {
    id: "post-1000",
    authorId: "user-1",
    authorName: "Ava Martinez",
    caption: "Sunset vibes from the Seattle waterfront 🌅",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    likes: 42,
    likedByViewer: false,
    moderationStatus: "APPROVED",
    createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    comments: [
      {
        id: "comment-1",
        authorId: "user-2",
        authorName: "Noah Chen",
        text: "This lighting is perfection 🔥",
        createdAt: new Date(Date.now() - 3400 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "post-1001",
    authorId: "user-3",
    authorName: "Priya Patel",
    caption: "Tuning pipeline observability dashboards before launch 🚀",
    imageUrl:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80",
    likes: 12,
    likedByViewer: true,
    moderationStatus: "PENDING",
    createdAt: new Date(Date.now() - 2000 * 1000).toISOString(),
    comments: [],
  },
];

export const feedStore = atom<FeedItem[]>(seedItems);

export const pendingModeration = computed(
  feedStore,
  (items) => items.filter((item) => item.moderationStatus === "PENDING").length,
);

export const getFeedSnapshot = () => feedStore.get();

export const getFeedItem = (id: string) => feedStore.get().find((item) => item.id === id);

export const getPostsByAuthor = (authorId: string) =>
  feedStore.get().filter((item) => item.authorId === authorId);

export const toggleLike = (id: string) => {
  feedStore.set(
    feedStore.get().map((item) =>
      item.id === id
        ? {
            ...item,
            likedByViewer: !item.likedByViewer,
            likes: item.likes + (item.likedByViewer ? -1 : 1),
          }
        : item,
    ),
  );
};

export const addComment = (id: string, text: string) => {
  const trimmed = text.trim();
  if (!trimmed) {
    return;
  }

  feedStore.set(
    feedStore.get().map((item) =>
      item.id === id
        ? {
            ...item,
            comments: [
              ...item.comments,
              {
                id: `comment-${Date.now()}`,
                authorId: "viewer",
                authorName: "You",
                text: trimmed,
                createdAt: new Date().toISOString(),
              },
            ],
          }
        : item,
    ),
  );
};

// Feed filtering
export type FeedFilter = "global" | "following";

export const feedFilterStore = atom<FeedFilter>("global");

// Mock current user - in real app, get from auth context
const currentUserId = "user-2"; // Noah

export const filteredFeedStore = computed([feedStore, feedFilterStore], (feedItems, filter) => {
  if (filter === "global") {
    return feedItems;
  }

  if (filter === "following") {
    const followingUsers = getFollowingUsers(currentUserId);
    const followingIds = followingUsers.map((user) => user.id);
    return feedItems.filter((item) => followingIds.includes(item.authorId));
  }

  return feedItems;
});

export const setFeedFilter = (filter: FeedFilter) => {
  feedFilterStore.set(filter);
};

// Search functionality
export const searchPosts = (query: string) => {
  if (!query.trim()) return feedStore.get();

  const lowercaseQuery = query.toLowerCase();
  return feedStore
    .get()
    .filter(
      (post) =>
        post.caption.toLowerCase().includes(lowercaseQuery) ||
        post.authorName.toLowerCase().includes(lowercaseQuery),
    );
};
