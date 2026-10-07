import { ApiError } from './errors';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

interface RequestOptions {
  signal?: AbortSignal;
}

/**
 * Centralized HTTP client (Constitution §3.3 / §13b). Domain service files
 * under src/services/ MUST route all backend calls through this module
 * rather than calling fetch/axios directly. Owns base URL, auth header
 * injection, and transport-level error normalization.
 *
 * Currently implemented with `fetch`; swap the internals for an Axios
 * instance here if/when Axios is introduced, with no required changes to
 * callers.
 */
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        // TODO: inject auth token here once a real auth/session API exists.
      },
      signal: options.signal,
    });
  } catch {
    throw new ApiError('Network error. Please check your connection and try again.');
  }

  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status);
  }

  return (await response.json()) as T;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, options),
};
