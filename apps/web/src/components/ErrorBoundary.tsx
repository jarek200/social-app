import { Component, ErrorInfo, ReactNode } from "preact/compat";
import { useState } from "preact/hooks";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service in production
    if (import.meta.env.PUBLIC_AMPLIFY_ENV === "production") {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error }: { error?: Error }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div class="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div class="max-w-md w-full rounded-3xl border border-red-500/20 bg-slate-900/60 p-8 text-center">
        <div class="mb-6">
          <div class="mx-auto w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 class="text-xl font-semibold text-white mb-2">Something went wrong</h1>
          <p class="text-slate-400 text-sm">
            We're sorry, but something unexpected happened. Please try refreshing the page.
          </p>
        </div>

        <div class="space-y-3">
          <button
            onClick={() => window.location.reload()}
            class="w-full rounded-full bg-brand-500 px-6 py-3 font-semibold text-white transition hover:bg-brand-600"
          >
            Refresh Page
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            class="w-full rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:border-brand-400 hover:text-brand-200"
          >
            Go Home
          </button>

          {import.meta.env.PUBLIC_AMPLIFY_ENV !== "production" && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              class="w-full text-sm text-slate-400 hover:text-slate-300"
            >
              {showDetails ? "Hide" : "Show"} Error Details
            </button>
          )}
        </div>

        {showDetails && error && (
          <div class="mt-6 p-4 rounded-2xl bg-slate-800/50 border border-white/10">
            <pre class="text-xs text-red-300 text-left overflow-auto max-h-32">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
