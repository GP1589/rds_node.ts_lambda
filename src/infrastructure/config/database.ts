import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export class DatabaseConfig {
  private static client: DynamoDBDocumentClient;

  public static getClient(): DynamoDBDocumentClient {
    if (!this.client) {
      const dynamoClient = new DynamoDBClient({
        region: process.env.AWS_REGION || 'us-east-1',
        ...(process.env.NODE_ENV === 'development' && {
          endpoint: 'http://localhost:8000', // Para DynamoDB local
          credentials: {
            accessKeyId: 'fake',
            secretAccessKey: 'fake'
          }
        })
      });

      this.client = DynamoDBDocumentClient.from(dynamoClient);
    }
    return this.client;
  }
}