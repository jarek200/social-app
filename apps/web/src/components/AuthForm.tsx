import { Alert, Button, Input } from "@components/ui";
import { useStore } from "@nanostores/preact";
import { authStore, confirmSignUpCode, signInUser, signOutUser, signUpUser } from "@services/auth";
import { useEffect, useState } from "preact/hooks";

type AuthMode = "signin" | "signup" | "confirm";

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const authState = useStore(authStore);

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
    setSuccessMessage(null);

    try {
      if (mode === "signin") {
        await signInUser(username, password);
      } else if (mode === "signup") {
        const result = await signUpUser(username, password, email);
        if (result.requiresConfirmation) {
          setMode("confirm");
          setSuccessMessage("✅ Check your email for confirmation code!");
        }
      } else if (mode === "confirm") {
        await confirmSignUpCode(username, confirmationCode);
        setSuccessMessage("✅ Email confirmed! Now sign in.");
        setMode("signin");
        setConfirmationCode("");
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
        {mode === "confirm" ? (
          // Confirmation code form
          <div class="grid gap-2 text-sm">
            <label htmlFor="confirmationCode">Confirmation Code</label>
            <Input
              id="confirmationCode"
              type="text"
              placeholder="123456"
              value={confirmationCode}
              onInput={(e) => setConfirmationCode((e.target as HTMLInputElement).value)}
              required
              disabled={isLoading}
            />
            <p class="text-xs text-slate-400">Enter the 6-digit code sent to {email}</p>
          </div>
        ) : (
          // Sign in / Sign up form
          <div class="space-y-4">
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
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <Button type="submit" disabled={isLoading} loading={isLoading}>
          {mode === "signin" ? "Sign In" : mode === "signup" ? "Sign Up" : "Confirm Email"}
        </Button>
      </form>

      {mode !== "confirm" && (
        <div class="mt-6 text-center">
          <Button
            variant="secondary"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setSuccessMessage(null);
            }}
            disabled={isLoading}
          >
            {mode === "signin"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </Button>
        </div>
      )}

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
