import { queries } from "@services/appsyncClient";
import { getFeedSnapshot } from "@stores/feed";
import { useEffect, useState } from "preact/hooks";

interface PostDetailProps {
  postId: string;
}

type DisplayPost = {
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

type DisplayComment = {
  id: string;
  owner: string;
  body: string;
  createdAt: string;
};

export function PostDetail({ postId }: PostDetailProps) {
  const [post, setPost] = useState<DisplayPost | null>(null);
  const [comments, setComments] = useState<DisplayComment[]>([]);
  const [loading, setLoading] = useState(true);

  // Check for demo mode
  const isDemoMode = import.meta.env.PUBLIC_DEMO_MODE === "true";

  useEffect(() => {
    const load = async () => {
      try {
        if (isDemoMode) {
          // Use demo data
          const feed = getFeedSnapshot();
          const foundPost = feed.find((item) => item.id === postId);
          if (foundPost) {
            setPost({
              id: foundPost.id,
              caption: foundPost.caption,
              photoUrl: foundPost.imageUrl,
              moderationStatus: foundPost.moderationStatus,
              likeCount: foundPost.likes,
              commentCount: foundPost.comments.length,
              createdAt: foundPost.createdAt,
              owner: foundPost.authorId,
              feedId: "GLOBAL",
            });
            setComments(
              foundPost.comments.map((c) => ({
                id: c.id,
                owner: c.authorName,
                body: c.text,
                createdAt: c.createdAt,
              })),
            );
          }
        } else {
          // Real backend
          const fetchedPost = await queries.getPost(postId);
          setPost({
            id: fetchedPost.id,
            caption: fetchedPost.caption,
            photoUrl: fetchedPost.photoUrl,
            moderationStatus: fetchedPost.moderationStatus,
            likeCount: fetchedPost.likeCount,
            commentCount: fetchedPost.commentCount,
            createdAt: fetchedPost.createdAt,
            owner: fetchedPost.owner,
            feedId: fetchedPost.feedId,
          });
          const fetchedComments = await queries.listCommentsForPost(postId);
          setComments(
            fetchedComments.map((c) => ({
              id: c.id,
              owner: c.owner,
              body: c.body,
              createdAt: c.createdAt,
            })),
          );
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isDemoMode, postId]);

  if (loading || !post) {
    return (
      <div class="rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-center text-slate-400">
        <p class="text-slate-400">{loading ? "Loading..." : "Post not found"}</p>
      </div>
    );
  }

  return (
    <article class="grid gap-6 rounded-3xl border border-white/10 bg-slate-900/60 p-6">
      <header class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm font-semibold text-slate-300">{post.owner}</p>
          <p class="text-xs text-slate-500">{new Date(post.createdAt).toLocaleString()}</p>
        </div>
        <span class="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">
          {post.moderationStatus}
        </span>
      </header>

      <img src={post.photoUrl} alt={post.caption} class="w-full rounded-2xl object-cover" />

      <section class="space-y-2">
        <h1 class="text-xl font-semibold text-white">{post.caption}</h1>
        <div class="flex gap-4 text-sm text-slate-300">
          <span>{post.likeCount} likes</span>
          <span>{post.commentCount} comments</span>
        </div>
      </section>

      <section class="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-slate-400">Comments</h2>
        <ul class="mt-3 space-y-3 text-sm text-slate-200">
          {comments.map((comment) => (
            <li key={comment.id} class="rounded-xl bg-slate-900 px-3 py-2">
              <span class="font-semibold text-white">{comment.owner}</span> {comment.body}
            </li>
          ))}
          {comments.length === 0 && <li class="text-slate-400">No comments yet.</li>}
        </ul>
        <div class="mt-4 rounded-xl border border-dashed border-white/20 bg-slate-950/40 p-4 text-sm text-slate-400">
          Comment submissions hook into AppSync mutations once the realtime backend is connected.
        </div>
      </section>
    </article>
  );
}
