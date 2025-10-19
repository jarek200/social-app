import { Alert, Button, Input } from "@components/ui";
import { authStore, signInUser, signOutUser, signUpUser } from "@services/auth";
import { useEffect, useState } from "preact/hooks";

type AuthMode = "signin" | "signup";

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authState = authStore.get();

  // Redirect if already authenticated
  useEffect(() => {
    if (authState.isAuthenticated) {
      window.location.href = "/";
    }
  }, [authState.isAuthenticated]);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === "signin") {
        await signInUser(username, password);
      } else {
        await signUpUser(username, password, email);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Sign out failed");
    }
  };

  if (authState.isAuthenticated) {
    return (
      <div class="text-center">
        <p class="text-green-200 mb-4">✅ You are signed in as {authState.user?.username}</p>
        <Button variant="danger" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} class="grid gap-4">
        {mode === "signup" && (
          <div class="grid gap-2 text-sm">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
              required
              disabled={isLoading}
            />
          </div>
        )}

        <div class="grid gap-2 text-sm">
          <label htmlFor="username">Username</label>
          <Input
            id="username"
            type="text"
            placeholder="your-username"
            value={username}
            onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
            required
            disabled={isLoading}
          />
        </div>

        <div class="grid gap-2 text-sm">
          <label htmlFor="password">Password</label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
            required
            disabled={isLoading}
          />
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Button type="submit" disabled={isLoading} loading={isLoading}>
          {mode === "signin" ? "Sign In" : "Sign Up"}
        </Button>
      </form>

      <div class="mt-6 text-center">
        <Button
          variant="secondary"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
          }}
          disabled={isLoading}
        >
          {mode === "signin"
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"}
        </Button>
      </div>

      <div class="mt-6 grid gap-3 text-sm">
        <Button variant="secondary" disabled={isLoading}>
          Sign in with Google
        </Button>
        <Button variant="secondary" disabled={isLoading}>
          Sign in with Apple
        </Button>
      </div>

      <p class="mt-6 text-center text-xs text-slate-500">
        {mode === "signin"
          ? "Sign in with your Cognito credentials"
          : "Create a new account with Cognito"}
      </p>
    </div>
  );
}
