import { Result } from '../../lib/Result';

/**
 * Returns a Result instance.
 * The errorFactory function is used to create a custom error type.
 */
export function apiResult<T>(fn: () => Promise<T>) {
  return Result.async(fn, errorFactory);
}

function errorFactory(error: unknown) {
  return error instanceof Error ? error : new Error('API error: ' + String(error));
}
