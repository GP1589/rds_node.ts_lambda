// src/config/DatabaseConfig.ts
import { PrismaClient } from "@prisma/client";

export class DatabaseConfig {
  private static prisma: PrismaClient;

  public static getClient(): PrismaClient {
    if (!this.prisma) {
      this.prisma = new PrismaClient({
        log:
          process.env.NODE_ENV === "development"
            ? ["query", "info", "warn", "error"]
            : ["error"],
      });
    }
    return this.prisma;
  }
}

