import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';
import { UserDto } from '../dtos/user';
import { DuplicateError } from '../exceptions/DuplicateError';
import { NotFoundError } from '../exceptions/NotFoundError';
import { UnauthorizedError } from '../exceptions/UnauthorizedError';
import { userRepository } from '../repositories/UserRepository';

const SALT_ROUNDS = 10;

export class UserService {
  async createUser(dto: UserDto.Create): Promise<UserDto.Response> {
    await this.verifyUniqueLogin(dto.login);

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = await userRepository.create({
      login: dto.login.toLowerCase(),
      firstName: dto.firstName,
      lastName: dto.lastName,
      passwordHash,
      roleId: 1, // UserRole.USER
    });
    return UserDto.toResponse(user);
  }

  async verifyLogin(dto: UserDto.Login): Promise<UserDto.AuthResponse> {
    const user = await userRepository.findByLogin(dto.username.toLowerCase());

    if (!user) {
      throw new UnauthorizedError();
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedError();
    }

    const roleName = user.role!.name;

    const token = this.generateToken(Number(user.id), user.login, roleName);

    return {
      ...UserDto.toResponse(user),
      auth: {
        access_token: token,
        token_type: 'Bearer',
        expires_in: env.JWT_EXPIRES_IN,
      },
    };
  }

  async getAllUsers(): Promise<UserDto.Response[]> {
    const users = await userRepository.findAll();
    return users.map(UserDto.toResponse);
  }

  async getUserById(id: number): Promise<UserDto.Response> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new NotFoundError(`User não encontrado para o id ${id}`);
    }
    return UserDto.toResponse(user);
  }

  private generateToken(userId: number, login: string, role: string): string {
    return jwt.sign({ userId: Number(userId), login, role }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });
  }

  private async verifyUniqueLogin(login: string): Promise<void> {
    const exists = await userRepository.existsByLoginILike(login);
    if (exists) {
      throw new DuplicateError('Usuario já cadastrado');
    }
  }
}

export const userService = new UserService();
