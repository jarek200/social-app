// Browser notification utilities
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!("Notification" in window)) {
    console.warn("This browser does not support desktop notifications");
    return "denied";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  if (Notification.permission === "denied") {
    return "denied";
  }

  const permission = await Notification.requestPermission();
  return permission;
};

export const sendNotification = (title: string, options?: NotificationOptions): boolean => {
  if (Notification.permission !== "granted") {
    console.warn("Notification permission not granted");
    return false;
  }

  try {
    const notification = new Notification(title, {
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      ...options,
    });

    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    return true;
  } catch (error) {
    console.error("Error sending notification:", error);
    return false;
  }
};

// Social app specific notifications
export const notifyNewPost = (authorName: string, caption: string) => {
  sendNotification("New Post", {
    body: `${authorName}: ${caption.slice(0, 100)}${caption.length > 100 ? "..." : ""}`,
    icon: "/favicon.ico",
    tag: "new-post",
  });
};

export const notifyNewLike = (likerName: string, postCaption: string) => {
  sendNotification("New Like", {
    body: `${likerName} liked your post: ${postCaption.slice(0, 50)}...`,
    icon: "/favicon.ico",
    tag: "new-like",
  });
};

export const notifyNewComment = (commenterName: string, comment: string) => {
  sendNotification("New Comment", {
    body: `${commenterName}: ${comment.slice(0, 80)}${comment.length > 80 ? "..." : ""}`,
    icon: "/favicon.ico",
    tag: "new-comment",
  });
};

export const notifyNewFollower = (followerName: string) => {
  sendNotification("New Follower", {
    body: `${followerName} started following you`,
    icon: "/favicon.ico",
    tag: "new-follower",
  });
};
