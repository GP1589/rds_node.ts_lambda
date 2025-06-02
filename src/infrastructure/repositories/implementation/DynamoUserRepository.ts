import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { UserRepository } from "../../repositories/interfaces/UserRepository";
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from "../../../domain/entities/User";
import { DatabaseConfigDynamo } from "../../config/database";
import { NotFoundError } from "../../../transversal/exceptions/AppError";
import { v4 as uuidv4 } from "uuid";

export class DynamoUserRepository implements UserRepository {
  private readonly tableName = "chris-dev-users";
  private readonly dynamoClient = DatabaseConfigDynamo.getClient();

  async create(userData: CreateUserRequest): Promise<User> {
    const userId = uuidv4().replace(/-/g, "").substring(0, 8);
    const user: User = {
      userId,
      ...userData,
    };

    const command = new PutCommand({
      TableName: this.tableName,
      Item: user,
      ConditionExpression: "attribute_not_exists(userId)",
    });

    try {
      await this.dynamoClient.send(command);
      return user;
    } catch (error: any) {
      console.error("Error creating user:", error);
      if (error.name === "ConditionalCheckFailedException") {
        throw new Error("User with this ID already exists");
      }
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async findById(userId: string): Promise<User | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { userId },
    });

    try {
      const result = await this.dynamoClient.send(command);
      return (result.Item as User) || null;
    } catch (error: any) {
      console.error("Error finding user by ID:", error);
      throw new Error(`Failed to find user: ${error.message}`);
    }
  }

  async findAll(): Promise<User[]> {
    console.log(`Attempting to scan table: ${this.tableName}`);

    const command = new ScanCommand({
      TableName: this.tableName,
    });

    try {
      console.log("Sending scan command to DynamoDB...");
      const result = await this.dynamoClient.send(command);

      console.log("DynamoDB scan result:", {
        Count: result.Count,
        ScannedCount: result.ScannedCount,
        ItemsLength: result.Items?.length || 0,
        HasItems: !!result.Items,
      });

      // Validar que result.Items existe y es un array
      if (!result.Items) {
        console.log("No items returned from DynamoDB");
        return [];
      }

      // Log de los primeros items para debugging
      if (result.Items.length > 0) {
        console.log(
          "First item structure:",
          JSON.stringify(result.Items[0], null, 2)
        );
      }

      const users = result.Items as User[];
      console.log(`Successfully fetched ${users.length} users`);
      return users;
    } catch (error: any) {
      // Log detallado del error
      console.error("Detailed error in findAll:", {
        name: error.name,
        message: error.message,
        code: error.code,
        statusCode: error.$metadata?.httpStatusCode,
        requestId: error.$metadata?.requestId,
        stack: error.stack,
      });

      // Errores específicos de DynamoDB
      if (error.name === "ResourceNotFoundException") {
        throw new Error(`Table '${this.tableName}' does not exist`);
      }

      if (error.name === "ValidationException") {
        throw new Error(`Invalid request: ${error.message}`);
      }

      if (error.name === "UnrecognizedClientException") {
        throw new Error("AWS credentials are invalid or missing");
      }

      if (error.name === "AccessDeniedException") {
        throw new Error("Insufficient permissions to access DynamoDB table");
      }

      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  async update(
    userId: string,
    userData: UpdateUserRequest
  ): Promise<User | null> {
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
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: "attribute_exists(userId)",
      ReturnValues: "ALL_NEW",
    });

    try {
      const result = await this.dynamoClient.send(command);
      return result.Attributes as User;
    } catch (error: any) {
      console.error("Error updating user:", error);
      if (error.name === "ConditionalCheckFailedException") {
        return null;
      }
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async delete(userId: string): Promise<boolean> {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: { userId },
      ConditionExpression: "attribute_exists(userId)",
    });

    try {
      await this.dynamoClient.send(command);
      return true;
    } catch (error: any) {
      console.error("Error deleting user:", error);
      if (error.name === "ConditionalCheckFailedException") {
        return false;
      }
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  // Método para verificar conectividad y existencia de tabla
  async healthCheck(): Promise<{ status: string; details: any }> {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
        Limit: 1, // Solo obtener 1 item para verificar conectividad
      });

      const result = await this.dynamoClient.send(command);

      return {
        status: "OK",
        details: {
          tableName: this.tableName,
          itemCount: result.Count,
          scannedCount: result.ScannedCount,
          hasItems: !!result.Items && result.Items.length > 0,
        },
      };
    } catch (error: any) {
      return {
        status: "ERROR",
        details: {
          tableName: this.tableName,
          errorName: error.name,
          errorMessage: error.message,
          errorCode: error.code,
        },
      };
    }
  }
}
