export class AppError extends Error {
  public readonly status: number;
  public readonly title: string;
  public readonly errors?: { field: string; message: string }[];

  constructor(
    status: number,
    title: string,
    detail: string,
    errors?: { field: string; message: string }[],
  ) {
    super(detail);
    this.status = status;
    this.title = title;
    this.errors = errors;
    this.name = 'AppError';
  }
}
