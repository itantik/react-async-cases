export class Ok<V> {
  /**
   * @param value - result value
   */
  constructor(readonly value: V) {}

  isOk(): this is Ok<V> {
    return true;
  }

  isErr(): this is never {
    return false;
  }
}

export class Err<E> {
  /**
   * @param error - result error
   */
  constructor(readonly error: E) {}

  isOk(): this is never {
    return false;
  }

  isErr(): this is Err<E> {
    return true;
  }
}

export function ok<V>(value: V): Ok<V> {
  return new Ok(value);
}

export function err<E>(error: E): Err<E> {
  return new Err(error);
}

export async function asyncResult<V, E>(
  asyncFn: () => Promise<V>,
  errorFactory?: (error: unknown) => E | Err<E>,
) {
  try {
    return ok(await asyncFn());
  } catch (e) {
    const error = errorFactory ? errorFactory(e) : (e as E | Err<E>);
    return error instanceof Err ? error : err(error);
  }
}

export function syncResult<V, E>(syncFn: () => V, errorFactory?: (error: unknown) => E | Err<E>) {
  try {
    return ok(syncFn());
  } catch (e) {
    const error = errorFactory ? errorFactory(e) : (e as E | Err<E>);
    return error instanceof Err ? error : err(error);
  }
}

export type Result<V, E> = Ok<V> | Err<E>;

export const Result = {
  ok,
  err,
  async: asyncResult,
  sync: syncResult,
};
