import { User, CreateUserRequest, UpdateUserRequest } from '../../domain/entities/User';
import { UserRepository } from "../../infrastructure/repositories/interfaces/UserRepository";
import { ISystemRepository } from "../../infrastructure/repositories/interfaces/SystemRepository";

import { System } from '../../domain/entities/System';


export class SystemService {
  constructor(private systemRepository: ISystemRepository) {}

  async create(systemData: System): Promise<System> {
    return await this.systemRepository.create(systemData);
  }

  async getAll(): Promise<System[]> {
    return await this.systemRepository.getAll();
  }
}