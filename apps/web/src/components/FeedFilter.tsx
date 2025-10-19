import { useStore } from "@nanostores/preact";
import { type FeedFilter, feedFilterStore, setFeedFilter } from "@stores/feed";
import type { JSX } from "preact";

export function FeedFilterComponent(): JSX.Element {
  const currentFilter = useStore(feedFilterStore);

  const handleFilterChange = (filter: FeedFilter) => {
    setFeedFilter(filter);
  };

  return (
    <div class="flex gap-2 text-xs">
      <button
        type="button"
        class={`rounded-full px-3 py-2 font-semibold text-white transition ${
          currentFilter === "global"
            ? "bg-brand-500"
            : "border border-white/20 hover:border-brand-400 hover:text-brand-200"
        }`}
        onClick={() => handleFilterChange("global")}
      >
        Global
      </button>
      <button
        type="button"
        class={`rounded-full px-3 py-2 font-semibold text-white transition ${
          currentFilter === "following"
            ? "bg-brand-500"
            : "border border-white/20 hover:border-brand-400 hover:text-brand-200"
        }`}
        onClick={() => handleFilterChange("following")}
      >
        Following
      </button>
    </div>
  );
}
