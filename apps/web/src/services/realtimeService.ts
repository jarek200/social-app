import { atom } from "nanostores";
import { subscriptions } from "./appsyncClient";

// Real-time event types
export type FeedEvent = {
  postId: string;
  type: "POST_CREATED" | "POST_LIKED" | "POST_COMMENTED" | "POST_MODERATED";
  payload: any;
  createdAt: string;
};

// Real-time stores
export const realtimeEventsStore = atom<FeedEvent[]>([]);
export const isConnectedStore = atom<boolean>(false);
export const connectionErrorStore = atom<string | null>(null);

// Subscription management
let currentSubscription: { unsubscribe: () => void } | null = null;

// Real-time operations
export const realtimeOperations = {
  async connectToFeed(feedId: string = "GLOBAL") {
    try {
      // Disconnect existing subscription
      if (currentSubscription) {
        currentSubscription.unsubscribe();
      }

      // Connect to new feed
      currentSubscription = subscriptions.onFeedEvent(feedId, (data: any) => {
        const event: FeedEvent = {
          postId: data.postId,
          type: data.type,
          payload: data.payload,
          createdAt: data.createdAt,
        };

        // Add to events store
        const currentEvents = realtimeEventsStore.get();
        realtimeEventsStore.set([event, ...currentEvents.slice(0, 49)]); // Keep last 50 events

        // Handle different event types
        this.handleFeedEvent(event);
      });

      isConnectedStore.set(true);
      connectionErrorStore.set(null);
      console.log(`Connected to real-time feed: ${feedId}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to connect to real-time feed";
      connectionErrorStore.set(errorMessage);
      isConnectedStore.set(false);
      console.error("Real-time connection error:", error);
    }
  },

  disconnect() {
    if (currentSubscription) {
      currentSubscription.unsubscribe();
      currentSubscription = null;
    }
    isConnectedStore.set(false);
    console.log("Disconnected from real-time feed");
  },

  handleFeedEvent(event: FeedEvent) {
    console.log("Real-time event received:", event);
    
    // Here you would typically update your stores based on the event type
    // For example:
    // - POST_CREATED: Add new post to posts store
    // - POST_LIKED: Update like count
    // - POST_COMMENTED: Update comment count
    // - POST_MODERATED: Update moderation status
    
    // Emit custom events for components to listen to
    window.dispatchEvent(new CustomEvent('feedEvent', { detail: event }));
  },

  // Demo mode simulation
  simulateEvent(feedId: string = "GLOBAL") {
    const demoEvents: FeedEvent[] = [
      {
        postId: "demo-post-1",
        type: "POST_LIKED",
        payload: { userId: "user-2", userName: "Noah Chen" },
        createdAt: new Date().toISOString(),
      },
      {
        postId: "demo-post-2",
        type: "POST_COMMENTED",
        payload: { userId: "user-3", userName: "Ava Martinez", comment: "Great post!" },
        createdAt: new Date().toISOString(),
      },
    ];

    // Simulate random events every 10-30 seconds
    const simulateRandomEvent = () => {
      const randomEvent = demoEvents[Math.floor(Math.random() * demoEvents.length)];
      this.handleFeedEvent(randomEvent);
      
      // Schedule next event
      const nextDelay = Math.random() * 20000 + 10000; // 10-30 seconds
      setTimeout(simulateRandomEvent, nextDelay);
    };

    // Start simulation
    setTimeout(simulateRandomEvent, 5000); // Start after 5 seconds
    isConnectedStore.set(true);
    console.log("Demo mode: Real-time simulation started");
  },
};

// Auto-connect on module load (demo mode)
if (import.meta.env.PUBLIC_DEMO_MODE === "true" || !import.meta.env.PUBLIC_APPSYNC_URL) {
  realtimeOperations.simulateEvent();
}
