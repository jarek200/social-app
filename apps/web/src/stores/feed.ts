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

// Empty initial state - data loaded from backend or demo mode
const seedItems: FeedItem[] = [];

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
