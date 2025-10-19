/**
 * Seed DynamoDB with demo users/posts for local testing.
 * Requires AWS credentials, the `TABLE_NAME` environment variable,
 * and the `tsx` runner (`npx tsx scripts/seed-demo-data.ts`).
 */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { BatchWriteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { pk, sk } from "@social/shared";

if (!process.env.TABLE_NAME) {
  throw new Error("TABLE_NAME environment variable is required");
}

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const now = new Date().toISOString();
const tableName = process.env.TABLE_NAME;

const items = [
  {
    PutRequest: {
      Item: {
        PK: pk.user("ava"),
        SK: sk.user(),
        Handle: "ava",
        DisplayName: "Ava Martinez",
        CreatedAt: now,
        UpdatedAt: now
      }
    }
  },
  {
    PutRequest: {
      Item: {
        PK: pk.post("seed-1"),
        SK: sk.post(),
        GSI1PK: pk.feed("GLOBAL"),
        GSI1SK: `POST#${now}`,
        Caption: "Seeding from scripts/seed-demo-data.ts",
        PhotoUrl: "https://images.unsplash.com/photo-1526481280695-3c4693e32273?auto=format&fit=crop&w=1200&q=80",
        PhotoStorageKey: "public/demo/photos/seed-1.jpg",
        OwnerId: "ava",
        ModerationStatus: "APPROVED",
        LikeCount: 10,
        CommentCount: 3,
        CreatedAt: now,
        UpdatedAt: now
      }
    }
  }
];

async function main() {
  await client.send(
    new BatchWriteCommand({
      RequestItems: {
        [tableName]: items
      }
    })
  );

  console.log(`Seeded ${items.length} items into ${tableName}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
