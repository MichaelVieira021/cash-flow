import { z } from 'zod';

import { User } from '../models/User';

export namespace UserSchema {
  export const createSchema = z.object({
    login: z.string().min(10, 'Login deve ter ao menos 10 caracteres'),
    password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
    firstName: z.string().min(1, 'Nome é obrigatório'),
    lastName: z.string().min(1, 'Sobrenome é obrigatório'),
  });

  export const loginSchema = z.object({
    username: z.string().min(1, 'Username é obrigatório'),
    password: z.string().min(1, 'Senha é obrigatória'),
  });
}

export namespace UserDto {
  export type Create = z.infer<typeof UserSchema.createSchema>;
  export type Login = z.infer<typeof UserSchema.loginSchema>;

  export interface Response {
    id: number;
    login: string;
    firstName: string;
    lastName: string;
    roleId: number;
  }

  export interface AuthResponse extends Response {
    auth: {
      access_token: string;
      token_type: string;
      expires_in: string;
    };
  }

  export function toResponse(user: User): Response {
    return {
      id: Number(user.id),
      login: user.login,
      firstName: user.firstName,
      lastName: user.lastName,
      roleId: Number(user.roleId),
    };
  }
}
