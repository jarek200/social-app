import { useEffect, useState } from "preact/hooks";
import { getFeedSnapshot } from "@stores/feed";

interface PostDetailProps {
  postId: string;
}

export function PostDetail({ postId }: PostDetailProps) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check for demo mode
  const isDemoMode =
    import.meta.env.PUBLIC_DEMO_MODE === "true" || !import.meta.env.PUBLIC_APPSYNC_URL;

  useEffect(() => {
    const loadPost = async () => {
      if (isDemoMode) {
        // Use demo data
        const feed = getFeedSnapshot();
        const foundPost = feed.find((item) => item.id === postId);
        setPost(foundPost || null);
      } else {
        // In production, fetch from AppSync
        // TODO: Implement real post fetching
        setPost(null);
      }
      setLoading(false);
    };

    loadPost();
  }, [postId, isDemoMode]);

  if (loading) {
    return (
      <div class="flex items-center justify-center p-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div class="rounded-3xl border border-white/10 bg-slate-900/60 p-12 text-center">
        <p class="text-slate-400">Post not found</p>
      </div>
    );
  }

  return (
    <article class="grid gap-6 rounded-3xl border border-white/10 bg-slate-900/60 p-6">
      <header class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm font-semibold text-slate-300">{post.authorName}</p>
          <p class="text-xs text-slate-500">{new Date(post.createdAt).toLocaleString()}</p>
        </div>
        <span class="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">
          {post.moderationStatus}
        </span>
      </header>

      <img src={post.imageUrl} alt={post.caption} class="w-full rounded-2xl object-cover" />

      <section class="space-y-2">
        <h1 class="text-xl font-semibold text-white">{post.caption}</h1>
        <div class="flex gap-4 text-sm text-slate-300">
          <span>{post.likes} likes</span>
          <span>{post.comments.length} comments</span>
        </div>
      </section>

      <section class="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-slate-400">Comments</h2>
        <ul class="mt-3 space-y-3 text-sm text-slate-200">
          {post.comments.map((comment: any) => (
            <li key={comment.id} class="rounded-xl bg-slate-900 px-3 py-2">
              <span class="font-semibold text-white">{comment.authorName}</span> {comment.text}
            </li>
          ))}
          {post.comments.length === 0 && <li class="text-slate-400">No comments yet.</li>}
        </ul>
        <div class="mt-4 rounded-xl border border-dashed border-white/20 bg-slate-950/40 p-4 text-sm text-slate-400">
          Comment submissions hook into AppSync mutations once the realtime backend is connected.
        </div>
      </section>
    </article>
  );
}

