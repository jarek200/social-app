import { useStore } from "@nanostores/preact";
import { useMemo, useState } from "preact/hooks";
import { chatChannelsStore, chatMessagesStore } from "../stores/chat";

export function ChatConsole() {
  const channels = useStore(chatChannelsStore);
  const messages = useStore(chatMessagesStore);
  const [activeId, setActiveId] = useState(channels[0]?.id ?? "");

  const activeMessages = useMemo(
    () => messages.filter((message) => message.channelId === activeId),
    [messages, activeId]
  );

  return (
    <div class="grid gap-4 lg:grid-cols-[220px_1fr]">
      <aside class="rounded-2xl border border-white/10 bg-slate-900/60 p-3">
        <h2 class="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Channels</h2>
        <ul class="space-y-2 text-sm text-slate-200">
          {channels.map((channel) => {
            const isActive = channel.id === activeId;
            return (
              <li key={channel.id}>
                <button
                  class={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition ${
                    isActive ? "bg-brand-500/20 text-brand-100" : "hover:bg-white/10"
                  }`}
                  onClick={() => setActiveId(channel.id)}
                >
                  <span>{channel.name}</span>
                  {channel.unread > 0 && (
                    <span class="rounded-full bg-emerald-500/20 px-2 py-1 text-[10px] font-semibold text-emerald-200">
                      {channel.unread}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <section class="grid h-full grid-rows-[auto_1fr_auto] rounded-2xl border border-white/10 bg-slate-900/60">
        <header class="flex items-center justify-between border-b border-white/5 px-4 py-3">
          <div>
            <p class="text-sm font-semibold text-white">
              {channels.find((channel) => channel.id === activeId)?.name ?? "Select channel"}
            </p>
            <p class="text-xs text-slate-400">
              {channels.find((channel) => channel.id === activeId)?.participants.join(", ")}
            </p>
          </div>
          <button class="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white transition hover:border-brand-400 hover:text-brand-200">
            Start call
          </button>
        </header>

        <div class="flex flex-col gap-3 overflow-y-auto px-4 py-4 text-sm text-slate-100">
          {activeMessages.length === 0 && (
            <p class="text-center text-slate-500">No messages yet. Be the first to start the conversation.</p>
          )}
          {activeMessages.map((message) => (
            <div key={message.id} class="max-w-lg rounded-2xl bg-white/10 px-4 py-2">
              <p class="text-xs text-brand-100">{message.sender}</p>
              <p>{message.body}</p>
              <p class="text-right text-[10px] text-slate-400">
                {new Date(message.createdAt).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>

        <form class="flex items-center gap-3 border-t border-white/5 px-4 py-3">
          <input
            type="text"
            placeholder="Type a message..."
            class="flex-1 rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
          />
          <button
            type="submit"
            class="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-400"
          >
            Send
          </button>
        </form>
      </section>
    </div>
  );
}
