import { describe, it, expect, vi, beforeEach } from "vitest";
import { authStore, signInUser, signUpUser, initializeAuth } from "../auth";

// Mock AWS Amplify
vi.mock("aws-amplify/auth", () => ({
  getCurrentUser: vi.fn(),
  fetchAuthSession: vi.fn(),
  signIn: vi.fn(),
  signUp: vi.fn(),
  confirmSignUp: vi.fn(),
  signOut: vi.fn(),
}));

describe("Authentication Service", () => {
  beforeEach(() => {
    // Reset auth store before each test
    authStore.set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  describe("initializeAuth", () => {
    it("should set authenticated state when user exists", async () => {
      const mockUser = {
        userId: "user-123",
        username: "testuser",
        signInDetails: { loginId: "test@example.com" },
      };
      const mockSession = {
        tokens: {
          idToken: { toString: () => "mock-token" },
        },
      };

      const { getCurrentUser, fetchAuthSession } = await import("aws-amplify/auth");
      vi.mocked(getCurrentUser).mockResolvedValue(mockUser);
      vi.mocked(fetchAuthSession).mockResolvedValue(mockSession);

      await initializeAuth();

      const authState = authStore.get();
      expect(authState.isAuthenticated).toBe(true);
      expect(authState.user?.id).toBe("user-123");
      expect(authState.user?.username).toBe("testuser");
      expect(authState.user?.email).toBe("test@example.com");
    });

    it("should set unauthenticated state when no user", async () => {
      const { getCurrentUser, fetchAuthSession } = await import("aws-amplify/auth");
      vi.mocked(getCurrentUser).mockRejectedValue(new Error("No user"));
      vi.mocked(fetchAuthSession).mockRejectedValue(new Error("No session"));

      await initializeAuth();

      const authState = authStore.get();
      expect(authState.isAuthenticated).toBe(false);
      expect(authState.user).toBeNull();
    });
  });

  describe("signInUser", () => {
    it("should sign in user successfully", async () => {
      const mockUser = {
        userId: "user-123",
        username: "testuser",
        signInDetails: { loginId: "test@example.com" },
      };
      const mockSession = {
        tokens: {
          idToken: { toString: () => "mock-token" },
        },
      };

      const { signIn, getCurrentUser, fetchAuthSession } = await import("aws-amplify/auth");
      vi.mocked(signIn).mockResolvedValue({
        isSignedIn: true,
        nextStep: { signInStep: "DONE" },
      });
      vi.mocked(getCurrentUser).mockResolvedValue(mockUser);
      vi.mocked(fetchAuthSession).mockResolvedValue(mockSession);

      await signInUser("testuser", "password123");

      const authState = authStore.get();
      expect(authState.isAuthenticated).toBe(true);
      expect(authState.user?.username).toBe("testuser");
    });

    it("should handle sign in errors", async () => {
      const { signIn } = await import("aws-amplify/auth");
      vi.mocked(signIn).mockRejectedValue(new Error("Invalid credentials"));

      await signInUser("testuser", "wrongpassword");

      const authState = authStore.get();
      expect(authState.isAuthenticated).toBe(false);
      expect(authState.error).toBe("Invalid credentials");
    });
  });

  describe("signUpUser", () => {
    it("should sign up user successfully", async () => {
      const { signUp } = await import("aws-amplify/auth");
      vi.mocked(signUp).mockResolvedValue({
        isSignUpComplete: true,
        nextStep: { signUpStep: "DONE" },
      });

      const result = await signUpUser("testuser", "password123", "test@example.com");

      expect(result.success).toBe(true);
      expect(result.requiresConfirmation).toBe(false);
    });

    it("should handle sign up requiring confirmation", async () => {
      const { signUp } = await import("aws-amplify/auth");
      vi.mocked(signUp).mockResolvedValue({
        isSignUpComplete: false,
        nextStep: { signUpStep: "CONFIRM_SIGN_UP" },
      });

      const result = await signUpUser("testuser", "password123", "test@example.com");

      expect(result.success).toBe(true);
      expect(result.requiresConfirmation).toBe(true);
    });
  });
});
