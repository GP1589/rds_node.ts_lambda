import { User, CreateUserRequest, UpdateUserRequest } from '../../domain/entities/User';
import { UserRepository } from "../../infrastructure/repositories/interfaces/UserRepository";
import { v4 as uuidv4 } from 'uuid';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(userData: CreateUserRequest): Promise<User> {
    const userId = uuidv4().replace(/-/g, '').substring(0, 8);
    return await this.userRepository.create(userData);
  }

  async getUserById(userId: string): Promise<User | null> {
    return await this.userRepository.findById(userId);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async updateUser(userId: string, userData: UpdateUserRequest): Promise<User | null> {
    return await this.userRepository.update(userId, userData);
  }

  async deleteUser(userId: string): Promise<boolean> {
    return await this.userRepository.delete(userId);
  }
}