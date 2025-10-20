import { atom } from "nanostores";

export type Notification = {
  id: string;
  type: "LIKE" | "COMMENT" | "FOLLOW";
  actor: string;
  message: string;
  createdAt: string;
  read: boolean;
};

// Empty initial state - data loaded from backend or demo mode
const seed: Notification[] = [];

export const notificationsStore = atom<Notification[]>(seed);

export const markNotificationRead = (id: string) => {
  notificationsStore.set(
    notificationsStore.get().map((notif) =>
      notif.id === id
        ? {
            ...notif,
            read: true,
          }
        : notif,
    ),
  );
};

export const unreadCount = (): number =>
  notificationsStore.get().filter((notif) => !notif.read).length;

export const getNotificationSnapshot = () => notificationsStore.get();
