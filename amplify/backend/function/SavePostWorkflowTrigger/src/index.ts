import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const sfnClient = new SFNClient();
const snsClient = new SNSClient();

export const handler = async (event: any) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  try {
    const { input } = event;

    // Start the Step Function execution
    const stateMachineArn = process.env.SAVE_POST_STATE_MACHINE_ARN!;
    const executionParams = {
      stateMachineArn,
      input: JSON.stringify(input),
    };

    const executionResult = await sfnClient.send(new StartExecutionCommand(executionParams));
    console.log('Step Function execution started:', executionResult.executionArn);

    // Publish event to SNS topic
    const topicArn = process.env.FEED_TOPIC_ARN!;
    const publishParams = {
      TopicArn: topicArn,
      Message: JSON.stringify({
        type: 'POST_CREATED',
        postId: input.id,
        userId: input.owner,
        timestamp: new Date().toISOString(),
      }),
    };

    await snsClient.send(new PublishCommand(publishParams));
    console.log('Event published to SNS');

    return {
      statusCode: 200,
      body: JSON.stringify({
        executionArn: executionResult.executionArn,
        message: 'Post processing started successfully',
      }),
    };
  } catch (error) {
    console.error('Error processing post:', error);
    throw error;
  }
};
