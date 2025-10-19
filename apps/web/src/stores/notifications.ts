import { atom } from "nanostores";

export type Notification = {
  id: string;
  type: "LIKE" | "COMMENT" | "FOLLOW";
  actor: string;
  message: string;
  createdAt: string;
  read: boolean;
};

const seed: Notification[] = [
  {
    id: "notif-1",
    type: "LIKE",
    actor: "Priya Patel",
    message: "liked your post \"Sunset vibes\"",
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: "notif-2",
    type: "COMMENT",
    actor: "Noah Chen",
    message: "commented \"Releasing tonight?\"",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: "notif-3",
    type: "FOLLOW",
    actor: "Maya Stone",
    message: "started following you",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    read: true
  }
];

export const notificationsStore = atom<Notification[]>(seed);

export const markNotificationRead = (id: string) => {
  notificationsStore.set(
    notificationsStore.get().map((notif) =>
      notif.id === id
        ? {
            ...notif,
            read: true
          }
        : notif
    )
  );
};

export const unreadCount = (): number => notificationsStore.get().filter((notif) => !notif.read).length;

export const getNotificationSnapshot = () => notificationsStore.get();
