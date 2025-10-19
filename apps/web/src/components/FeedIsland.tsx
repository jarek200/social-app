import { useStore } from "@nanostores/preact";
import type { JSX } from "preact";
import { useState } from "preact/hooks";
import { addComment, feedStore, toggleLike } from "../stores/feed";

const formatTimeAgo = (isoDate: string) => {
  const elapsedMs = Date.now() - new Date(isoDate).getTime();
  const elapsedMinutes = Math.round(elapsedMs / 60000);
  if (elapsedMinutes < 1) {
    return "just now";
  }
  if (elapsedMinutes < 60) {
    return `${elapsedMinutes}m ago`;
  }
  const hours = Math.round(elapsedMinutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.round(hours / 24);
  return `${days}d ago`;
};

const moderationBadgeClasses: Record<string, string> = {
  APPROVED: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30",
  PENDING: "bg-amber-500/10 text-amber-300 border border-amber-500/30",
  REJECTED: "bg-rose-500/10 text-rose-300 border border-rose-500/30",
};

export function FeedIsland(): JSX.Element {
  const feed = useStore(feedStore);

  return (
    <div class="grid gap-6">
      {feed.map((item) => (
        <article
          key={item.id}
          class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-lg shadow-brand-500/10"
        >
          <header class="flex items-center justify-between gap-3 px-6 py-4">
            <div>
              <p class="font-semibold text-white">{item.authorName}</p>
              <p class="text-sm text-slate-400">{formatTimeAgo(item.createdAt)}</p>
            </div>
            <span
              class={`rounded-full px-3 py-1 text-xs font-semibold ${moderationBadgeClasses[item.moderationStatus]}`}
            >
              {item.moderationStatus}
            </span>
          </header>
          <div class="relative">
            <img
              src={item.imageUrl}
              alt={item.caption}
              loading="lazy"
              class="h-96 w-full rounded-none object-cover md:rounded-t-2xl"
            />
          </div>
          <div class="space-y-4 px-6 py-4">
            <p class="text-lg text-slate-100">{item.caption}</p>
            <div class="flex items-center justify-between text-sm text-slate-300">
              <button
                type="button"
                class={`flex items-center gap-2 rounded-full px-3 py-1 transition ${
                  item.likedByViewer ? "bg-brand-500/20 text-brand-200" : "hover:bg-white/5"
                }`}
                onClick={() => toggleLike(item.id)}
              >
                <span>{item.likedByViewer ? "♥" : "♡"}</span>
                <span>{item.likes} likes</span>
              </button>
              <span>{item.comments.length} comments</span>
            </div>
            <CommentComposer postId={item.id} />
            <ul class="space-y-3">
              {item.comments.map((comment) => (
                <li key={comment.id} class="rounded-xl bg-white/5 px-4 py-3 text-sm text-slate-200">
                  <span class="font-semibold text-white">{comment.authorName}</span> {comment.text}
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  );
}

type ComposerProps = {
  postId: string;
};

function CommentComposer({ postId }: ComposerProps): JSX.Element {
  const [draft, setDraft] = useState("");

  const onSubmit = (event: Event) => {
    event.preventDefault();
    addComment(postId, draft);
    setDraft("");
  };

  return (
    <form class="flex items-center gap-3" onSubmit={onSubmit}>
      <input
        aria-label="Add a comment"
        class="flex-1 rounded-full border border-white/10 bg-slate-900/40 px-4 py-2 text-sm text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
        placeholder="Share your thoughts..."
        value={draft}
        onInput={(event) => setDraft((event.target as HTMLInputElement).value)}
      />
      <button
        type="submit"
        class="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:pointer-events-none disabled:opacity-50"
        disabled={!draft.trim()}
      >
        Post
      </button>
    </form>
  );
}
