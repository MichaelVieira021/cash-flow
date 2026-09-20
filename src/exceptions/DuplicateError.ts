import { AppError } from './AppError';

export class DuplicateError extends AppError {
  constructor(detail: string) {
    super(409, 'Recurso duplicado', detail);
    this.name = 'DuplicateError';
  }
}
