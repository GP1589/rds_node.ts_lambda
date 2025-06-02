export interface User {
  userId: string;
  email: string;
  name: string;
  position: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  position: string;
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
  position?: string;
}
