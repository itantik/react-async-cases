import { asyncResult } from '../../lib/Result';

/**
 * Uses asyncResult function from the library. It returns a Result instance.
 * The errorFactory function is used to create a custom error type.
 */
export function apiResult<T>(fn: () => Promise<T>) {
  return asyncResult(fn, errorFactory);
}

function errorFactory(error: unknown) {
  return error instanceof Error ? error : new Error('API error: ' + String(error));
}
