/**
 * Normalized application-level error for service/transport failures
 * (Constitution §13b). Components can rely on `.message` being
 * user-presentable without needing to know the transport details.
 */
export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}
