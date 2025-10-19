import { atom } from "nanostores";

// Demo data for development without AWS
export const demoPosts = [
  {
    id: "demo-post-1",
    caption: "Just deployed our new social app! 🚀",
    photoUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
    moderationStatus: "APPROVED" as const,
    likeCount: 42,
    commentCount: 8,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    owner: "user-1",
    feedId: "GLOBAL",
  },
  {
    id: "demo-post-2",
    caption: "Sunset coding session ☀️",
    photoUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
    moderationStatus: "APPROVED" as const,
    likeCount: 28,
    commentCount: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    owner: "user-2",
    feedId: "GLOBAL",
  },
  {
    id: "demo-post-3",
    caption: "Late night debugging energy 🔧",
    photoUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
    moderationStatus: "PENDING" as const,
    likeCount: 15,
    commentCount: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    owner: "user-3",
    feedId: "GLOBAL",
  },
];

export const demoComments = [
  {
    id: "demo-comment-1",
    postId: "demo-post-1",
    owner: "user-2",
    body: "Amazing work! 🎉",
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: "demo-comment-2",
    postId: "demo-post-1",
    owner: "user-3",
    body: "Love the design!",
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
];

// Demo stores
export const demoPostsStore = atom(demoPosts);
export const demoCommentsStore = atom(demoComments);
export const demoLikesStore = atom<string[]>([]);

// Demo operations
export const demoOperations = {
  async createPost(input: { caption: string; photoUrl: string }) {
    const newPost = {
      id: `demo-post-${Date.now()}`,
      caption: input.caption,
      photoUrl: input.photoUrl,
      moderationStatus: "PENDING" as const,
      likeCount: 0,
      commentCount: 0,
      createdAt: new Date().toISOString(),
      owner: "current-user",
      feedId: "GLOBAL",
    };

    const currentPosts = demoPostsStore.get();
    demoPostsStore.set([newPost, ...currentPosts]);
    return newPost;
  },

  async createComment(input: { postId: string; body: string }) {
    const newComment = {
      id: `demo-comment-${Date.now()}`,
      postId: input.postId,
      owner: "current-user",
      body: input.body,
      createdAt: new Date().toISOString(),
    };

    const currentComments = demoCommentsStore.get();
    demoCommentsStore.set([...currentComments, newComment]);

    // Update comment count
    const currentPosts = demoPostsStore.get();
    const updatedPosts = currentPosts.map((post) =>
      post.id === input.postId ? { ...post, commentCount: post.commentCount + 1 } : post,
    );
    demoPostsStore.set(updatedPosts);

    return newComment;
  },

  async toggleLike(postId: string) {
    const currentLikes = demoLikesStore.get();
    const isLiked = currentLikes.includes(postId);

    if (isLiked) {
      demoLikesStore.set(currentLikes.filter((id) => id !== postId));
    } else {
      demoLikesStore.set([...currentLikes, postId]);
    }

    // Update like count
    const currentPosts = demoPostsStore.get();
    const updatedPosts = currentPosts.map((post) =>
      post.id === postId
        ? { ...post, likeCount: isLiked ? post.likeCount - 1 : post.likeCount + 1 }
        : post,
    );
    demoPostsStore.set(updatedPosts);

    return { isLiked: !isLiked };
  },
};
