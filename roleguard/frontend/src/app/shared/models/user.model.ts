// src/app/shared/models/user.model.ts

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  userId: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  department: string;
  joinedAt: string;
  avatar: string;
  active: boolean;
}

export interface LoginRequest {
  userId: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
}
