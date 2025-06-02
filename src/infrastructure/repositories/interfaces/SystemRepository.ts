import { User, CreateUserRequest, UpdateUserRequest } from '../../../domain/entities/User';
import { System } from '../../../domain/entities/System';


export interface ISystemRepository {
  create(systemData: System): Promise<System>;
  getAll(): Promise<System[]>;

  // create(userData: CreateUserRequest): Promise<System>;
  // findById(userId: string): Promise<System | null>;
  // findAll(): Promise<System[]>;
  // update(userId: string, userData: UpdateUserRequest): Promise<System | null>;
  // delete(userId: string): Promise<boolean>;
}