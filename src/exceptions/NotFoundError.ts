import { AppError } from './AppError';

export class NotFoundError extends AppError {
  constructor(detail: string) {
    super(404, 'Recurso não encontrado', detail);
    this.name = 'NotFoundError';
  }
}
