// src/repositories/UserRepository.ts
import { DatabaseConfig } from "../../config/postgresql";
import { System } from "../../../domain/entities/System";
import { ISystemRepository } from "../../repositories/interfaces/SystemRepository";
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from "@prisma/client";


export class SystemRepository implements ISystemRepository {
  constructor(private prisma: PrismaClient) {}

  async create(systemData: System): Promise<System> {
    const userId = uuidv4();

    systemData.id = userId;

    const system = await this.prisma.system.create({
      data: systemData,
    });
    return system;
  }
  async getAll(): Promise<System[]> {
    return await this.prisma.system.findMany();
  }
}
