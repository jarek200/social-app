import { chatMessagesStore } from "@stores/chat";
import { addComment, feedStore, toggleLike } from "@stores/feed";
import { notifyNewComment, notifyNewLike, notifyNewPost } from "./notifications";

// Simulation data
const sampleCaptions = [
  "Beautiful sunset over the city skyline 🌅",
  "Working on some exciting new features 🚀",
  "Coffee and code - perfect morning combo ☕💻",
  "Team brainstorming session in progress 🧠",
  "Quick break to enjoy the outdoors 🌳",
  "Debugging the most stubborn bug ever 🐛",
  "Celebrating a successful deployment 🎉",
  "Learning something new every day 📚",
  "Weekend vibes starting early 🌞",
  "Pushing pixels and breaking builds 🎨",
];

const sampleComments = [
  "This looks amazing! 🔥",
  "Love the colors here 🎨",
  "So inspiring! Keep it up 💪",
  "This made my day 😊",
  "Beautiful work! 👏",
  "Can't wait to see more!",
  "This is exactly what I needed today",
  "Such a great perspective 📸",
  "Really captures the moment perfectly",
  "Outstanding work as always! 🌟",
];

const authors = [
  { id: "user-1", name: "Ava Martinez" },
  { id: "user-3", name: "Priya Patel" },
];

// Real-time simulation state
let isRunning = false;
let intervalHandles: Array<ReturnType<typeof setInterval>> = [];

export const startRealtimeSimulation = () => {
  if (isRunning) return;

  isRunning = true;
  console.log("🎯 Starting real-time simulation...");

  // Simulate new post every 30-60 seconds
  const postInterval = setInterval(
    () => {
      const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
      const randomCaption = sampleCaptions[Math.floor(Math.random() * sampleCaptions.length)];

      // Create new post
      const newPost = {
        id: `post-sim-${Date.now()}`,
        authorId: randomAuthor.id,
        authorName: randomAuthor.name,
        caption: randomCaption,
        imageUrl: `https://picsum.photos/600/400?random=${Date.now()}`,
        likes: Math.floor(Math.random() * 20),
        likedByViewer: false,
        createdAt: new Date().toISOString(),
        moderationStatus: "APPROVED" as const,
        comments: [] as Array<{
          id: string;
          authorId: string;
          authorName: string;
          text: string;
          createdAt: string;
        }>,
      };

      // Add to feed
      const currentFeed = feedStore.get();
      feedStore.set([newPost, ...currentFeed]);

      // Send browser notification
      notifyNewPost(randomAuthor.name, randomCaption);

      console.log(`📝 New post: ${randomAuthor.name} - ${randomCaption}`);
    },
    30000 + Math.random() * 30000,
  ); // 30-60 seconds
  intervalHandles.push(postInterval);

  // Simulate likes on existing posts every 15-30 seconds
  const likeInterval = setInterval(
    () => {
      const currentFeed = feedStore.get();
      if (currentFeed.length === 0) return;

      const randomPost = currentFeed[Math.floor(Math.random() * Math.min(currentFeed.length, 5))];
      if (!randomPost.likedByViewer && Math.random() > 0.7) {
        toggleLike(randomPost.id);
        notifyNewLike("Someone", randomPost.caption);
        console.log(`❤️ New like on: ${randomPost.caption.slice(0, 30)}...`);
      }
    },
    15000 + Math.random() * 15000,
  ); // 15-30 seconds
  intervalHandles.push(likeInterval);

  // Simulate comments every 45-90 seconds
  const commentInterval = setInterval(
    () => {
      const currentFeed = feedStore.get();
      if (currentFeed.length === 0) return;

      const randomPost = currentFeed[Math.floor(Math.random() * Math.min(currentFeed.length, 3))];
      const randomComment = sampleComments[Math.floor(Math.random() * sampleComments.length)];
      const commenterName = authors[Math.floor(Math.random() * authors.length)].name;

      addComment(randomPost.id, randomComment);
      notifyNewComment(commenterName, randomComment);

      console.log(`💬 New comment: ${commenterName} - ${randomComment}`);
    },
    45000 + Math.random() * 45000,
  ); // 45-90 seconds
  intervalHandles.push(commentInterval);

  // Simulate chat messages every 20-40 seconds
  const chatInterval = setInterval(
    () => {
      const chatMessages = [
        "Hey team, how's the deployment going?",
        "Just finished reviewing the latest PR",
        "Anyone up for a quick sync?",
        "The new feature looks great! 🚀",
        "Coffee break in 5? ☕",
        "Debugging a weird issue, any ideas?",
        "Just pushed the latest changes",
        "Meeting notes are in the shared doc",
        "Great work on that refactor! 👏",
        "Who's handling the user testing?",
      ];

      const randomMessage = chatMessages[Math.floor(Math.random() * chatMessages.length)];
      const randomSender = ["Ava", "Priya", "Noah"][Math.floor(Math.random() * 3)];

      const newMessage = {
        id: `chat-sim-${Date.now()}`,
        channelId: "ops",
        sender: randomSender,
        body: randomMessage,
        createdAt: new Date().toISOString(),
      };

      const currentMessages = chatMessagesStore.get();
      chatMessagesStore.set([...currentMessages, newMessage]);

      console.log(`💬 Chat: ${randomSender} - ${randomMessage}`);
    },
    20000 + Math.random() * 20000,
  ); // 20-40 seconds
  intervalHandles.push(chatInterval);
};

export const stopRealtimeSimulation = () => {
  if (!isRunning) {
    return;
  }

  for (const handle of intervalHandles) {
    clearInterval(handle);
  }
  intervalHandles = [];
  isRunning = false;
  console.log("🛑 Stopped real-time simulation");
};

export const isSimulationRunning = () => isRunning;

// Auto-start simulation when module loads (in development)
if (typeof window !== "undefined" && import.meta.env.DEV) {
  // Start after a delay to let the app load
  setTimeout(() => {
    startRealtimeSimulation();
  }, 2000);
}
