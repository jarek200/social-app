import { useState } from "preact/hooks";
import { isFollowing, followUser, unfollowUser } from "@stores/users";
import { Button } from "@components/ui";

interface FollowButtonProps {
  targetUserId: string;
  currentUserId?: string; // Optional - if not provided, assume no current user
}

export function FollowButton({ targetUserId, currentUserId }: FollowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Don't show button if no current user or if trying to follow yourself
  if (!currentUserId || currentUserId === targetUserId) {
    return null;
  }

  const isCurrentlyFollowing = isFollowing(currentUserId, targetUserId);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      if (isCurrentlyFollowing) {
        unfollowUser(currentUserId, targetUserId);
      } else {
        followUser(currentUserId, targetUserId);
      }
      // Force re-render by triggering state update
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating follow status:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isCurrentlyFollowing ? "secondary" : "primary"}
      onClick={handleClick}
      disabled={isLoading}
      loading={isLoading}
    >
      {isCurrentlyFollowing ? "Following" : "Follow"}
    </Button>
  );
}
