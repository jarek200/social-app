import { useEffect, useState } from "preact/hooks";
import { findUserByUsername, getPostsByAuthor } from "@stores/users";
import { FollowButton } from "./FollowButton";

interface UserProfileProps {
  username: string;
}

export function UserProfile({ username }: UserProfileProps) {
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = "user-2"; // Demo: Noah is logged in

  // Check for demo mode
  const isDemoMode = import.meta.env.PUBLIC_DEMO_MODE === "true";

  useEffect(() => {
    const loadProfile = async () => {
      if (isDemoMode) {
        // Use demo data
        const { findUserByUsername, getPostsByAuthor } = await import("@stores/users");
        const { getPostsByAuthor: getFeedPosts } = await import("@stores/feed");
        
        const userProfile = findUserByUsername(username);
        if (userProfile) {
          setProfile(userProfile);
          const userPosts = getFeedPosts(userProfile.id);
          setPosts(userPosts);
        }
      } else {
        // In production, fetch from AppSync
        // TODO: Implement real user profile fetching
        setProfile(null);
        setPosts([]);
      }
      setLoading(false);
    };

    loadProfile();
  }, [username, isDemoMode]);

  if (loading) {
    return (
      <div class="flex items-center justify-center p-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div class="rounded-3xl border border-white/10 bg-slate-900/60 p-12 text-center">
        <p class="text-slate-400">User not found</p>
      </div>
    );
  }

  return (
    <section class="grid gap-6 rounded-3xl border border-white/10 bg-slate-900/60 p-6">
      <header class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="flex items-center gap-4">
          <img src={profile.avatarUrl} alt={profile.displayName} class="h-16 w-16 rounded-full object-cover" />
          <div>
            <h1 class="text-2xl font-semibold text-white">{profile.displayName}</h1>
            <p class="text-sm text-slate-400">@{profile.username}</p>
            <p class="mt-2 text-sm text-slate-300">{profile.bio}</p>
          </div>
        </div>
        <div class="flex gap-3">
          <button class="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-brand-400 hover:text-brand-200" type="button">
            Message
          </button>
          <FollowButton targetUserId={profile.id} currentUserId={currentUserId} />
        </div>
      </header>

      <dl class="grid gap-4 sm:grid-cols-3">
        <div class="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <dt class="text-xs uppercase tracking-wide text-slate-400">Followers</dt>
          <dd class="text-2xl font-bold text-white">{profile.followers}</dd>
        </div>
        <div class="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <dt class="text-xs uppercase tracking-wide text-slate-400">Following</dt>
          <dd class="text-2xl font-bold text-white">{profile.following}</dd>
        </div>
        <div class="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <dt class="text-xs uppercase tracking-wide text-slate-400">Posts</dt>
          <dd class="text-2xl font-bold text-white">{profile.posts}</dd>
        </div>
      </dl>

      <section class="space-y-4">
        <h2 class="text-lg font-semibold text-white">Recent posts</h2>
        <ul class="grid gap-4">
          {posts.map((post) => (
            <li key={post.id} class="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <a href={`/post/${post.id}`} class="text-white">
                <h3 class="text-sm font-semibold">{post.caption}</h3>
                <p class="text-xs text-slate-400">Likes: {post.likes} · Comments: {post.comments.length}</p>
              </a>
            </li>
          ))}
          {posts.length === 0 && <li class="text-sm text-slate-400">No posts yet.</li>}
        </ul>
      </section>
    </section>
  );
}

