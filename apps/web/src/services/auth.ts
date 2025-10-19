// Note: These imports will work after installing aws-amplify
// import { signIn, signUp, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
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

    // const user = await getCurrentUser();
    // const session = await fetchAuthSession();

    // if (user && session.tokens) {
    //   authStore.set({
    //     user: {
    //       id: user.userId,
    //       username: user.username,
    //       email: user.signInDetails?.loginId,
    //     },
    //     isAuthenticated: true,
    //     isLoading: false,
    //     error: null,
    //   });
    // } else {
    //   authStore.set({
    //     user: null,
    //     isAuthenticated: false,
    //     isLoading: false,
    //     error: null,
    //   });
    // }

    // Temporary mock state until aws-amplify is installed
    authStore.set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  } catch (error) {
    console.log("No authenticated user:", error);
    authStore.set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }
};

export const signInUser = async (_username: string, _password: string) => {
  try {
    authStore.set({ ...authStore.get(), isLoading: true, error: null });

    // const { isSignedIn, nextStep } = await signIn({
    //   username,
    //   password,
    // });

    // if (isSignedIn) {
    //   await initializeAuth();
    // } else {
    //   authStore.set({
    //     ...authStore.get(),
    //     isLoading: false,
    //     error: `Sign in requires: ${nextStep.signInStep}`,
    //   });
    // }

    // Temporary mock response until aws-amplify is installed
    throw new Error("Authentication service not configured - install aws-amplify first");
  } catch (error) {
    authStore.set({
      ...authStore.get(),
      isLoading: false,
      error: error instanceof Error ? error.message : "Sign in failed",
    });
  }
};

export const signUpUser = async (_username: string, _password: string, _email: string) => {
  try {
    authStore.set({ ...authStore.get(), isLoading: true, error: null });

    // const { isSignUpComplete, nextStep } = await signUp({
    //   username,
    //   password,
    //   options: {
    //     userAttributes: {
    //       email,
    //     },
    //   },
    // });

    // if (isSignUpComplete) {
    //   await initializeAuth();
    // } else {
    //   authStore.set({
    //     ...authStore.get(),
    //     isLoading: false,
    //     error: `Sign up requires: ${nextStep.signUpStep}`,
    //   });
    // }

    // Temporary mock response until aws-amplify is installed
    throw new Error("Authentication service not configured - install aws-amplify first");
  } catch (error) {
    authStore.set({
      ...authStore.get(),
      isLoading: false,
      error: error instanceof Error ? error.message : "Sign up failed",
    });
  }
};

export const signOutUser = async () => {
  try {
    // await signOut();
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
