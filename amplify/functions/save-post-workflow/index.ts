import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";

const stateMachineArn = process.env.SAVE_POST_STATE_MACHINE_ARN;
const tableName = process.env.TABLE_NAME;
const publishTopicArn = process.env.FEED_TOPIC_ARN;
const appSyncApiId = process.env.APPSYNC_API_ID;
const sfn = new SFNClient({});

type SavePostEvent = {
  identity: {
    username: string;
    sub: string;
    claims?: Record<string, unknown>;
  };
  arguments: {
    input: {
      caption: string;
      photoStorageKey: string;
      photoUrl: string;
      feedId?: string | null;
    };
  };
};

exports.handler = async (event: SavePostEvent) => {
  if (!stateMachineArn || !tableName || !publishTopicArn || !appSyncApiId) {
    throw new Error(
      "Missing one of SAVE_POST_STATE_MACHINE_ARN, TABLE_NAME, FEED_TOPIC_ARN, or APPSYNC_API_ID environment variables"
    );
  }

  const { caption, photoStorageKey, photoUrl, feedId } = event.arguments.input;
  const username = event.identity?.username ?? event.identity?.sub;
  const now = new Date().toISOString();
  const postId = `post-${Date.now()}`;

  const input = JSON.stringify({
    requestId: `save-post-${Date.now()}`,
    viewerId: username,
    postId,
    post: {
      caption,
      photoStorageKey,
      photoUrl,
      feedId: feedId ?? "GLOBAL"
    },
    timestamps: {
      created: now,
      updated: now
    },
    config: {
      dynamoTableName: tableName,
      publishTopicArn,
      appSyncApiId
    }
  });

  await sfn.send(
    new StartExecutionCommand({
      stateMachineArn,
      input
    })
  );

  return {
    postId,
    status: "QUEUED",
    submittedAt: new Date().toISOString()
  };
};
