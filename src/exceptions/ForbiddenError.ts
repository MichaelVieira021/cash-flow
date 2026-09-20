import { AppError } from './AppError';

export class ForbiddenError extends AppError {
  constructor(detail = 'Acesso negado') {
    super(403, 'Acesso negado', detail);
    this.name = 'ForbiddenError';
  }
}
