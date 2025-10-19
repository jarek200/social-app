import type { PostRecord } from "@social/shared";
import { appsyncConfig, type AppSyncConfig } from "../config/appsync";

type GraphQLRequest<TVariables> = {
  query: string;
  variables?: TVariables;
};

const GRAPHQL_ENDPOINT = appsyncConfig.graphqlEndpoint;

async function callGraphQL<TData, TVariables = Record<string, unknown>>(
  request: GraphQLRequest<TVariables>,
  config: AppSyncConfig = appsyncConfig
): Promise<TData> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(config.apiKey ? { "x-api-key": config.apiKey } : {})
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    const errorPayload = await response.text();
    throw new Error(`AppSync request failed: ${response.status} ${errorPayload}`);
  }

  const payload = (await response.json()) as { data?: TData; errors?: unknown[] };
  if (payload.errors?.length) {
    throw new Error(JSON.stringify(payload.errors, null, 2));
  }

  if (!payload.data) {
    throw new Error("AppSync returned no data");
  }

  return payload.data;
}

export const mutations = {
  async savePost(input: { caption: string; photoStorageKey: string; photoUrl: string; feedId?: string }): Promise<string> {
    const data = await callGraphQL<{ savePost: { postId: string } }>({
      query: /* GraphQL */ `
        mutation SavePost($input: SavePostInput!) {
          savePost(input: $input) {
            postId
          }
        }
      `,
      variables: { input }
    });
    return data.savePost.postId;
  }
};

export const queries = {
  async listFeed(feedId: string): Promise<PostRecord[]> {
    const data = await callGraphQL<{ listPostsByFeed: { items: PostRecord[] } }>({
      query: /* GraphQL */ `
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
      variables: { feedId, sortDirection: "DESC" }
    });

    return data.listPostsByFeed.items;
  }
};
