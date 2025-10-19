import { generateClient } from "aws-amplify/api";
import { fetchAuthSession } from "aws-amplify/auth";

type PostRecord = {
  id: string;
  caption: string;
  photoUrl: string;
  moderationStatus: "PENDING" | "APPROVED" | "REJECTED";
  likeCount: number;
  commentCount: number;
  createdAt: string;
  owner: string;
  feedId: string;
};

type CommentRecord = {
  id: string;
  body: string;
  createdAt: string;
  owner: string;
  postId: string;
};

type LikeRecord = {
  id: string;
  postId: string;
  owner: string;
  createdAt: string;
};

type ProfileRecord = {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
};

type FeedEventData = {
  postId: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt: string;
};

// Create Amplify GraphQL client
const client = generateClient();

// Helper function to get auth headers
async function _getAuthHeaders() {
  try {
    const session = await fetchAuthSession();
    return {
      Authorization: session.tokens?.idToken?.toString() || "",
    };
  } catch (error) {
    console.warn("No auth session available:", error);
    return {};
  }
}

// Enhanced GraphQL client with auth
async function callGraphQL<TData, TVariables = Record<string, unknown>>(
  query: string,
  variables?: TVariables,
): Promise<TData> {
  try {
    const result = await client.graphql({
      query,
      variables,
      authMode: "userPool",
    });

    // Check if result has errors (for GraphQLResult)
    if ("errors" in result && result.errors && result.errors.length > 0) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors, null, 2)}`);
    }

    // Return data (for GraphQLResult)
    if ("data" in result) {
      return result.data as TData;
    }

    throw new Error("Invalid GraphQL result format");
  } catch (error) {
    console.error("GraphQL request failed:", error);
    throw error;
  }
}

export const mutations = {
  async savePost(input: {
    caption: string;
    photoStorageKey: string;
    photoUrl: string;
    feedId?: string;
  }): Promise<string> {
    const data = await callGraphQL<{ savePost: { postId: string } }>(
      /* GraphQL */ `
        mutation SavePost($input: SavePostInput!) {
          savePost(input: $input) {
            postId
          }
        }
      `,
      { input },
    );
    return data.savePost.postId;
  },

  async createPost(input: {
    caption: string;
    photoStorageKey: string;
    photoUrl: string;
    feedId?: string;
  }): Promise<PostRecord> {
    const data = await callGraphQL<{ createPost: PostRecord }>(
      /* GraphQL */ `
        mutation CreatePost($input: CreatePostInput!) {
          createPost(input: $input) {
            id
            caption
            photoUrl
            moderationStatus
            likeCount
            commentCount
            createdAt
            owner
            feedId
          }
        }
      `,
      { input },
    );
    return data.createPost;
  },

  async createComment(input: { postId: string; body: string }): Promise<CommentRecord> {
    const data = await callGraphQL<{ createComment: CommentRecord }>(
      /* GraphQL */ `
        mutation CreateComment($input: CreateCommentInput!) {
          createComment(input: $input) {
            id
            body
            createdAt
            owner
            postId
          }
        }
      `,
      { input },
    );
    return data.createComment;
  },

  async createLike(input: { postId: string }): Promise<LikeRecord> {
    const data = await callGraphQL<{ createLike: LikeRecord }>(
      /* GraphQL */ `
        mutation CreateLike($input: CreateLikeInput!) {
          createLike(input: $input) {
            id
            postId
            owner
            createdAt
          }
        }
      `,
      { input },
    );
    return data.createLike;
  },

  async deleteLike(input: { postId: string }): Promise<LikeRecord> {
    const data = await callGraphQL<{ deleteLike: LikeRecord }>(
      /* GraphQL */ `
        mutation DeleteLike($input: DeleteLikeInput!) {
          deleteLike(input: $input) {
            id
          }
        }
      `,
      { input },
    );
    return data.deleteLike;
  },
};

export const queries = {
  async listFeed(feedId: string): Promise<PostRecord[]> {
    const data = await callGraphQL<{ listPostsByFeed: { items: PostRecord[] } }>(
      /* GraphQL */ `
        query ListFeed($feedId: ID!, $sortDirection: ModelSortDirection) {
          listPostsByFeed(feedId: $feedId, sortDirection: $sortDirection, limit: 20) {
            items {
              id
              caption
              photoUrl
              moderationStatus
              likeCount
              commentCount
              createdAt
              owner
              feedId
            }
          }
        }
      `,
      { feedId, sortDirection: "DESC" },
    );

    return data.listPostsByFeed.items;
  },

  async getPost(id: string): Promise<PostRecord> {
    const data = await callGraphQL<{ getPost: PostRecord }>(
      /* GraphQL */ `
        query GetPost($id: ID!) {
          getPost(id: $id) {
            id
            caption
            photoUrl
            moderationStatus
            likeCount
            commentCount
            createdAt
            owner
            feedId
          }
        }
      `,
      { id },
    );
    return data.getPost;
  },

  async listCommentsForPost(postId: string): Promise<CommentRecord[]> {
    const data = await callGraphQL<{ listCommentsForPost: { items: CommentRecord[] } }>(
      /* GraphQL */ `
        query ListCommentsForPost($postId: ID!) {
          listCommentsForPost(postId: $postId) {
            items {
              id
              body
              createdAt
              owner
              postId
            }
          }
        }
      `,
      { postId },
    );
    return data.listCommentsForPost.items;
  },

  async myProfile(): Promise<ProfileRecord> {
    const data = await callGraphQL<{ myProfile: ProfileRecord }>(
      /* GraphQL */ `
        query MyProfile {
          myProfile {
            id
            handle
            displayName
            avatarUrl
            bio
            createdAt
            updatedAt
          }
        }
      `,
    );
    return data.myProfile;
  },
};

// Real-time subscriptions
export const subscriptions = {
  async onFeedEvent(feedId: string, callback: (data: FeedEventData) => void) {
    const subscription = await client.graphql({
      query: /* GraphQL */ `
        subscription OnFeedEvent($feedId: ID!) {
          onFeedEvent(feedId: $feedId) {
            postId
            type
            payload
            createdAt
          }
        }
      `,
      variables: { feedId },
      authMode: "userPool",
    });

    return subscription.subscribe({
      next: (data: FeedEventData) => callback(data),
      error: (error: unknown) => console.error("Subscription error:", error),
    });
  },
};
