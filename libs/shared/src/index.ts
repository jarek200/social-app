export type ModerationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type UserProfile = {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
};

export type PostRecord = {
  id: string;
  owner: string;
  feedId: string;
  caption: string;
  photoStorageKey: string;
  photoUrl: string;
  moderationStatus: ModerationStatus;
  moderationReason?: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CommentRecord = {
  id: string;
  postId: string;
  owner: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export const pk = {
  user: (id: string) => `USER#${id}`,
  post: (id: string) => `POST#${id}`,
  comment: (postId: string) => `POST#${postId}`,
  feed: (feedId: string) => `FEED#${feedId}`
} as const;

export const sk = {
  user: () => "PROFILE",
  post: () => "POST",
  comment: (commentId: string) => `COMMENT#${commentId}`,
  like: (userId: string) => `LIKE#${userId}`
} as const;
