import { 
  fetchAuthSession, 
  getCurrentUser, 
  signIn, 
  signOut, 
  signUp,
  confirmSignUp 
} from "aws-amplify/auth";
import { atom } from "nanostores";

export type User = {
  id: string;
  username: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const authStore = atom<AuthState>(initialAuthState);

// Initialize auth state
export const initializeAuth = async () => {
  try {
    authStore.set({ ...authStore.get(), isLoading: true });

    const user = await getCurrentUser().catch(() => null);
    const session = await fetchAuthSession().catch(() => null);

    if (user && session?.tokens) {
      authStore.set({
        user: {
          id: user.userId,
          username: user.username,
          email: user.signInDetails?.loginId,
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } else {
      authStore.set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  } catch (_error) {
    authStore.set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }
};

export const signInUser = async (username: string, password: string) => {
  try {
    authStore.set({ ...authStore.get(), isLoading: true, error: null });

    const { isSignedIn, nextStep } = await signIn({ username, password });

    if (isSignedIn) {
      await initializeAuth();
    } else {
      authStore.set({
        ...authStore.get(),
        isLoading: false,
        error: `Sign in requires: ${nextStep.signInStep}`,
      });
    }
  } catch (error) {
    authStore.set({
      ...authStore.get(),
      isLoading: false,
      error: error instanceof Error ? error.message : "Sign in failed",
    });
  }
};

export const signUpUser = async (username: string, password: string, email: string) => {
  try {
    authStore.set({ ...authStore.get(), isLoading: true, error: null });

    const { isSignUpComplete, nextStep } = await signUp({
      username,
      password,
      options: {
        userAttributes: { email },
      },
    });

    if (isSignUpComplete) {
      authStore.set({ ...authStore.get(), isLoading: false, error: null });
      return { success: true, requiresConfirmation: false };
    } else {
      authStore.set({
        ...authStore.get(),
        isLoading: false,
        error: null,
      });
      return { 
        success: true, 
        requiresConfirmation: true,
        nextStep: nextStep.signUpStep 
      };
    }
  } catch (error) {
    authStore.set({
      ...authStore.get(),
      isLoading: false,
      error: error instanceof Error ? error.message : "Sign up failed",
    });
    throw error;
  }
};

export const confirmSignUpCode = async (username: string, code: string) => {
  try {
    authStore.set({ ...authStore.get(), isLoading: true, error: null });

    const { isSignUpComplete } = await confirmSignUp({
      username,
      confirmationCode: code,
    });

    if (isSignUpComplete) {
      authStore.set({ ...authStore.get(), isLoading: false, error: null });
      return { success: true };
    }

    authStore.set({
      ...authStore.get(),
      isLoading: false,
      error: "Confirmation incomplete",
    });
    return { success: false };
  } catch (error) {
    authStore.set({
      ...authStore.get(),
      isLoading: false,
      error: error instanceof Error ? error.message : "Confirmation failed",
    });
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut();
    authStore.set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  } catch (error) {
    authStore.set({
      ...authStore.get(),
      error: error instanceof Error ? error.message : "Sign out failed",
    });
  }
};

// Initialize auth on module load
if (typeof window !== "undefined") {
  initializeAuth();
}
