import { atom } from "nanostores";

export type ChatMessage = {
  id: string;
  channelId: string;
  sender: string;
  body: string;
  createdAt: string;
};

export type ChatChannel = {
  id: string;
  name: string;
  participants: string[];
  unread: number;
};

const channels: ChatChannel[] = [
  { id: "ops", name: "Ops Team", participants: ["Ava", "Priya", "Noah"], unread: 2 },
  { id: "mods", name: "Moderators", participants: ["Jordan", "Sky"], unread: 0 },
  { id: "alpha", name: "Alpha Launch", participants: ["Team"], unread: 5 }
];

const messages: ChatMessage[] = [
  {
    id: "msg-1",
    channelId: "ops",
    sender: "Priya",
    body: "Workflow re-ran and approved the backlog.",
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString()
  },
  {
    id: "msg-2",
    channelId: "ops",
    sender: "Ava",
    body: "Awesome, pushing configurations live.",
    createdAt: new Date(Date.now() - 60 * 1000).toISOString()
  },
  {
    id: "msg-3",
    channelId: "alpha",
    sender: "Noah",
    body: "Need final approvals for the feature flag rollout.",
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  }
];

export const chatChannelsStore = atom<ChatChannel[]>(channels);
export const chatMessagesStore = atom<ChatMessage[]>(messages);

export const getMessagesForChannel = (channelId: string) =>
  chatMessagesStore.get().filter((message) => message.channelId === channelId);
