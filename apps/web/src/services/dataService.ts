import { atom } from "nanostores";
import { mutations, queries, subscriptions } from "./appsyncClient";
import { authStore } from "./auth";
import { demoOperations, demoPostsStore } from "./demoService";

// Check if we're in demo mode
const isDemoMode = import.meta.env.PUBLIC_DEMO_MODE === "true";

export type Post = {
  id: string;
  caption: string;
  photoUrl: string;
  moderationStatus: "PENDING" | "APPROVED" | "REJECTED";
  likeCount: number;
  commentCount: number;
  createdAt: string;
  owner: string;
  feedId: string;
};

export type Comment = {
  id: string;
  postId: string;
  owner: string;
  body: string;
  createdAt: string;
};

export type Like = {
  id: string;
  postId: string;
  owner: string;
  createdAt: string;
};

// Real data stores
export const postsStore = atom<Post[]>([]);
export const commentsStore = atom<Comment[]>([]);
export const likesStore = atom<Like[]>([]);
export const isLoadingStore = atom<boolean>(false);
export const errorStore = atom<string | null>(null);

// Feed operations
export const loadFeed = async (feedId: string = "GLOBAL") => {
  try {
    isLoadingStore.set(true);
    errorStore.set(null);

    if (isDemoMode) {
      // Use demo data
      const demoPosts = demoPostsStore.get();
      postsStore.set(demoPosts);
    } else {
      // Use real AppSync
      const posts = await queries.listFeed(feedId);
      postsStore.set(posts);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to load feed";
    errorStore.set(errorMessage);
    console.error("Load feed error:", error);
  } finally {
    isLoadingStore.set(false);
  }
};

export const createPost = async (input: {
  caption: string;
  photoStorageKey: string;
  photoUrl: string;
  feedId?: string;
}) => {
  try {
    isLoadingStore.set(true);
    errorStore.set(null);

    if (isDemoMode) {
      // Use demo operations
      const newPost = await demoOperations.createPost({
        caption: input.caption,
        photoUrl: input.photoUrl,
      });
      return newPost;
    } else {
      // Use real AppSync
      const newPost = await mutations.createPost(input);
      // Add to store optimistically
      const currentPosts = postsStore.get();
      postsStore.set([newPost, ...currentPosts]);
      return newPost;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create post";
    errorStore.set(errorMessage);
    console.error("Create post error:", error);
    throw error;
  } finally {
    isLoadingStore.set(false);
  }
};

export const savePost = async (input: {
  caption: string;
  photoStorageKey: string;
  photoUrl: string;
  feedId?: string;
}) => {
  try {
    isLoadingStore.set(true);
    errorStore.set(null);

    const postId = await mutations.savePost(input);

    // The post will be added to the feed via the Step Functions workflow
    // and real-time subscription will update the UI

    return postId;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to save post";
    errorStore.set(errorMessage);
    console.error("Save post error:", error);
    throw error;
  } finally {
    isLoadingStore.set(false);
  }
};

// Comment operations
export const loadComments = async (postId: string) => {
  try {
    const comments = await queries.listCommentsForPost(postId);
    commentsStore.set(comments);
    return comments;
  } catch (error) {
    console.error("Load comments error:", error);
    throw error;
  }
};

export const addComment = async (postId: string, body: string) => {
  try {
    const newComment = await mutations.createComment({ postId, body });

    // Add to store optimistically
    const currentComments = commentsStore.get();
    commentsStore.set([...currentComments, newComment]);

    // Update post comment count
    const currentPosts = postsStore.get();
    postsStore.set(
      currentPosts.map((post) =>
        post.id === postId ? { ...post, commentCount: post.commentCount + 1 } : post,
      ),
    );

    return newComment;
  } catch (error) {
    console.error("Add comment error:", error);
    throw error;
  }
};

// Like operations
export const toggleLike = async (postId: string) => {
  try {
    const currentLikes = likesStore.get();
    const existingLike = currentLikes.find((like) => like.postId === postId);

    if (existingLike) {
      // Unlike
      await mutations.deleteLike({ postId });
      likesStore.set(currentLikes.filter((like) => like.postId !== postId));

      // Update post like count
      const currentPosts = postsStore.get();
      postsStore.set(
        currentPosts.map((post) =>
          post.id === postId ? { ...post, likeCount: Math.max(0, post.likeCount - 1) } : post,
        ),
      );
    } else {
      // Like
      const newLike = await mutations.createLike({ postId });
      likesStore.set([...currentLikes, newLike]);

      // Update post like count
      const currentPosts = postsStore.get();
      postsStore.set(
        currentPosts.map((post) =>
          post.id === postId ? { ...post, likeCount: post.likeCount + 1 } : post,
        ),
      );
    }
  } catch (error) {
    console.error("Toggle like error:", error);
    throw error;
  }
};

// Real-time subscriptions
let feedSubscription: { unsubscribe: () => void } | null = null;

export const subscribeToFeed = (feedId: string = "GLOBAL") => {
  // Clean up existing subscription
  if (feedSubscription) {
    feedSubscription.unsubscribe();
  }

  feedSubscription = subscriptions.onFeedEvent(feedId, (data) => {
    console.log("Feed event received:", data);

    if (data.data?.onFeedEvent) {
      const event = data.data.onFeedEvent;

      switch (event.type) {
        case "POST_CREATED":
        case "POST_UPDATED":
          // Refresh the feed to get the latest posts
          loadFeed(feedId);
          break;
        case "MODERATION_UPDATED": {
          // Update post moderation status
          const currentPosts = postsStore.get();
          postsStore.set(
            currentPosts.map((post) =>
              post.id === event.postId ? { ...post, moderationStatus: event.payload.status } : post,
            ),
          );
          break;
        }
        case "COMMENT_CREATED":
          // Refresh comments for the post
          loadComments(event.postId);
          break;
        case "LIKE_UPDATED":
          // Refresh likes for the post
          // Could implement more granular updates here
          break;
      }
    }
  });

  return feedSubscription;
};

export const unsubscribeFromFeed = () => {
  if (feedSubscription) {
    feedSubscription.unsubscribe();
    feedSubscription = null;
  }
};

// Initialize data loading
export const initializeData = async () => {
  const authState = authStore.get();

  if (authState.isAuthenticated) {
    await loadFeed();
    subscribeToFeed();
  }
};

// Clean up on sign out
export const cleanupData = () => {
  postsStore.set([]);
  commentsStore.set([]);
  likesStore.set([]);
  unsubscribeFromFeed();
};
