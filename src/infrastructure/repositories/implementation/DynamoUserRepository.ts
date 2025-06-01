import { 
  PutCommand, 
  GetCommand, 
  ScanCommand, 
  UpdateCommand, 
  DeleteCommand 
} from '@aws-sdk/lib-dynamodb';
import { UserRepository } from '../../repositories/interfaces/UserRepository';
import { User, CreateUserRequest, UpdateUserRequest } from '../../../domain/entities/User';
import { DatabaseConfig } from '../../config/database';
import { NotFoundError } from '../../../transversal/exceptions/AppError';
import { v4 as uuidv4 } from 'uuid';

export class DynamoUserRepository implements UserRepository {
  private readonly tableName = 'chris-dev-users';
  private readonly dynamoClient = DatabaseConfig.getClient();

  async create(userData: CreateUserRequest): Promise<User> {
    const userId = uuidv4().replace(/-/g, '').substring(0, 8);
    const user: User = {
      userId,
      ...userData
    };

    const command = new PutCommand({
      TableName: this.tableName,
      Item: user,
      ConditionExpression: 'attribute_not_exists(userId)'
    });

    try {
      await this.dynamoClient.send(command);
      return user;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('User with this ID already exists');
      }
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async findById(userId: string): Promise<User | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { userId }
    });

    try {
      const result = await this.dynamoClient.send(command);
      return result.Item as User || null;
    } catch (error: any) {
      throw new Error(`Failed to find user: ${error.message}`);
    }
  }

  async findAll(): Promise<User[]> {
    const command = new ScanCommand({
      TableName: this.tableName
    });

    try {
      const result = await this.dynamoClient.send(command);
      return (result.Items as User[]) || [];
    } catch (error: any) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  async update(userId: string, userData: UpdateUserRequest): Promise<User | null> {
    const updateExpressions: string[] = [];
    const expressionAttributeNames: { [key: string]: string } = {};
    const expressionAttributeValues: { [key: string]: any } = {};

    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined) {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
      }
    });

    if (updateExpressions.length === 0) {
      return await this.findById(userId);
    }

    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { userId },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: 'attribute_exists(userId)',
      ReturnValues: 'ALL_NEW'
    });

    try {
      const result = await this.dynamoClient.send(command);
      return result.Attributes as User;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        return null;
      }
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async delete(userId: string): Promise<boolean> {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: { userId },
      ConditionExpression: 'attribute_exists(userId)'
    });

    try {
      await this.dynamoClient.send(command);
      return true;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        return false;
      }
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }
}