import { AppError } from './AppError';

export class UnauthorizedError extends AppError {
  constructor(detail = 'E-mail ou senha inválidos.') {
    super(401, 'Credenciais inválidas', detail);
    this.name = 'UnauthorizedError';
  }
}
