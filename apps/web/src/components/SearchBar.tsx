import { searchPosts } from "@stores/feed";
import { searchUsers } from "@stores/users";
import type { JSX } from "preact";
import { useMemo, useState } from "preact/hooks";

type SearchResult = {
  type: "user" | "post";
  id: string;
  title: string;
  subtitle: string;
  avatar?: string;
  imageUrl?: string;
};

export function SearchBar(): JSX.Element {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const searchResults = useMemo((): SearchResult[] => {
    if (!query.trim()) return [];

    const users = searchUsers(query)
      .slice(0, 3)
      .map((user) => ({
        type: "user" as const,
        id: user.id,
        title: user.displayName,
        subtitle: `@${user.username}`,
        avatar: user.avatarUrl,
      }));

    const posts = searchPosts(query)
      .slice(0, 3)
      .map((post) => ({
        type: "post" as const,
        id: post.id,
        title: post.caption.slice(0, 50) + (post.caption.length > 50 ? "..." : ""),
        subtitle: `by ${post.authorName}`,
        imageUrl: post.imageUrl,
      }));

    return [...users, ...posts];
  }, [query]);

  const handleSearch = (value: string) => {
    setQuery(value);
    setIsOpen(value.length > 0);
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === "user") {
      window.location.href = `/user/${result.subtitle.slice(1)}`; // Remove @ from username
    } else {
      window.location.href = `/post/${result.id}`;
    }
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div class="relative">
      <div class="relative">
        <input
          type="text"
          placeholder="Search users and posts..."
          value={query}
          onInput={(e) => handleSearch((e.target as HTMLInputElement).value)}
          class="w-full rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 pl-10 text-white placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
        />
        <div class="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Search icon">
            <title>Search</title>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {isOpen && searchResults.length > 0 && (
        <div class="absolute top-full z-50 mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur shadow-lg">
          <div class="p-2">
            {searchResults.map((result) => (
              <button
                type="button"
                key={`${result.type}-${result.id}`}
                onClick={() => handleResultClick(result)}
                class="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-white/10"
              >
                {result.avatar && (
                  <img
                    src={result.avatar}
                    alt={result.title}
                    class="h-8 w-8 rounded-full object-cover"
                  />
                )}
                {result.imageUrl && (
                  <img
                    src={result.imageUrl}
                    alt={result.title}
                    class="h-8 w-8 rounded object-cover"
                  />
                )}
                {!result.avatar && !result.imageUrl && (
                  <div class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/20">
                    {result.type === "user" ? (
                      <svg
                        class="h-4 w-4 text-brand-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-label="User icon"
                      >
                        <title>User</title>
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        class="h-4 w-4 text-brand-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-label="Post icon"
                      >
                        <title>Post</title>
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </div>
                )}
                <div class="flex-1">
                  <div class="text-sm font-semibold text-white">{result.title}</div>
                  <div class="text-xs text-slate-400">{result.subtitle}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
