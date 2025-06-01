import { User, CreateUserRequest, UpdateUserRequest } from '../../../domain/entities/User';

export interface UserRepository {
  create(userData: CreateUserRequest): Promise<User>;
  findById(userId: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(userId: string, userData: UpdateUserRequest): Promise<User | null>;
  delete(userId: string): Promise<boolean>;
}