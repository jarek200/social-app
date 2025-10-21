import { describe, it, expect, vi, beforeEach } from "vitest";
import { postsStore, loadFeed, createPost, savePost } from "../dataService";

// Mock AppSync client
vi.mock("../appsyncClient", () => ({
  queries: {
    listFeed: vi.fn(),
  },
  mutations: {
    savePost: vi.fn(),
  },
}));

// Mock auth store
vi.mock("../auth", () => ({
  authStore: {
    get: vi.fn(() => ({
      user: { id: "user-123" },
      isAuthenticated: true,
    })),
  },
}));

describe("Data Service", () => {
  beforeEach(() => {
    // Reset stores before each test
    postsStore.set([]);
  });

  describe("loadFeed", () => {
    it("should load feed successfully", async () => {
      const mockPosts = [
        {
          id: "post-1",
          caption: "Test post",
          photoUrl: "https://example.com/photo.jpg",
          moderationStatus: "APPROVED",
          likeCount: 5,
          commentCount: 2,
          createdAt: "2023-01-01T00:00:00Z",
          owner: "user-123",
          feedId: "GLOBAL",
        },
      ];

      const { queries } = await import("../appsyncClient");
      vi.mocked(queries.listFeed).mockResolvedValue(mockPosts);

      await loadFeed("GLOBAL");

      const posts = postsStore.get();
      expect(posts).toHaveLength(1);
      expect(posts[0].caption).toBe("Test post");
    });

    it("should handle feed loading errors", async () => {
      const { queries } = await import("../appsyncClient");
      vi.mocked(queries.listFeed).mockRejectedValue(new Error("Network error"));

      await loadFeed("GLOBAL");

      const posts = postsStore.get();
      expect(posts).toHaveLength(0);
    });
  });

  describe("savePost", () => {
    it("should save post with optimistic update", async () => {
      const mockPostId = "post-123";
      const postInput = {
        caption: "New post",
        photoStorageKey: "photos/123.jpg",
        photoUrl: "https://example.com/photo.jpg",
        feedId: "GLOBAL",
      };

      const { mutations } = await import("../appsyncClient");
      vi.mocked(mutations.savePost).mockResolvedValue(mockPostId);

      const result = await savePost(postInput);

      expect(result).toBe(mockPostId);

      const posts = postsStore.get();
      expect(posts).toHaveLength(1);
      expect(posts[0].caption).toBe("New post");
      expect(posts[0].moderationStatus).toBe("PENDING");
    });

    it("should rollback optimistic update on error", async () => {
      const postInput = {
        caption: "New post",
        photoStorageKey: "photos/123.jpg",
        photoUrl: "https://example.com/photo.jpg",
        feedId: "GLOBAL",
      };

      const { mutations } = await import("../appsyncClient");
      vi.mocked(mutations.savePost).mockRejectedValue(new Error("Save failed"));

      await expect(savePost(postInput)).rejects.toThrow("Save failed");

      const posts = postsStore.get();
      expect(posts).toHaveLength(0);
    });
  });

  describe("createPost", () => {
    it("should create post in demo mode", async () => {
      // Set demo mode
      vi.stubGlobal("import", {
        meta: {
          env: {
            PUBLIC_DEMO_MODE: "true",
          },
        },
      });

      const postInput = {
        caption: "Demo post",
        photoStorageKey: "photos/demo.jpg",
        photoUrl: "https://example.com/demo.jpg",
        feedId: "GLOBAL",
      };

      const result = await createPost(postInput);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
    });
  });
});
