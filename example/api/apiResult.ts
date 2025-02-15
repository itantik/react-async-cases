import { asyncResult, err, ok } from '../../lib/Result';

export async function apiResult<T>(fn: () => Promise<T>) {
  try {
    const response = await fn();
    return ok(response);
  } catch (e) {
    const error = e instanceof Error ? e : new Error('Unexpected API error');
    return err(error);
  }
}

export function apiResult2<T>(fn: () => Promise<T>) {
  return asyncResult(fn, errorFactory);
}

function errorFactory(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}
