import { Err, Ok, Result } from '../lib/main';

function createResult(isOk: boolean): Result<number, string> {
  if (isOk) {
    return new Ok(1);
  } else {
    return new Err('It failed');
  }
}

test('create Ok Result', () => {
  const result = createResult(true);

  expect(result).toBeInstanceOf(Ok);
  expect(result.isOk()).toBe(true);
  expect(result.isErr()).toBe(false);
  expect(result.isOk() && result.value).toBe(1);
});

test('create Err Result', () => {
  const result = createResult(false);

  expect(result).toBeInstanceOf(Err);
  expect(result.isOk()).toBe(false);
  expect(result.isErr()).toBe(true);
  expect(result.isErr() && result.error).toBe('It failed');
});

describe('ok() creates an Ok instance', () => {
  test.each([undefined, null, 1, false, true, 'hello'])('ok(%s)', (value) => {
    const okValue = Result.ok(value);

    expect(okValue).toBeInstanceOf(Ok);
    expect(okValue.value).toBe(value);
  });
});

test('err() creates an Err instance', () => {
  const errObj = new Error('It failed');
  const errResult = Result.err(errObj);

  expect(errResult).toBeInstanceOf(Err);
  expect(errResult.error).toBeInstanceOf(Error);
  expect(errResult.error).toStrictEqual(errObj);
});

test('asyncResult() returns an Ok instance', async () => {
  const fn = () => Promise.resolve(1);
  const result = Result.async(fn);

  expect(result).toBeInstanceOf(Promise);
  const res = await result;
  expect(res).toBeInstanceOf(Ok);
  expect(res.isOk()).toBe(true);
  expect(res.isErr()).toBe(false);
  if (res.isOk()) {
    expect(res.value).toBe(1);
  }
});

test('asyncResult() returns an Err instance', async () => {
  const fn = () => Promise.reject(new Error('It failed'));
  const result = Result.async(fn);

  expect(result).toBeInstanceOf(Promise);
  const res = await result;
  expect(res).toBeInstanceOf(Err);
  expect(res.isOk()).toBe(false);
  expect(res.isErr()).toBe(true);
  if (res.isErr()) {
    expect(res.error).toBeInstanceOf(Error);
    expect((res.error as Error).message).toBe('It failed');
  }
});

test('asyncResult() with errorFactory returns an Err instance', async () => {
  const fn = () => Promise.reject(new Error('It failed'));
  const result = Result.async(fn, () => new Error('Custom error message'));

  expect(result).toBeInstanceOf(Promise);
  const res = await result;
  expect(res).toBeInstanceOf(Err);
  expect(res.isOk()).toBe(false);
  expect(res.isErr()).toBe(true);
  if (res.isErr()) {
    expect(res.error).toBeInstanceOf(Error);
    expect(res.error.message).toBe('Custom error message');
  }
});
