const DELAY_MIN = 1000;
const DELAY_MAX = 2000;
function randomDelay() {
  return Math.floor(Math.random() * (DELAY_MAX - DELAY_MIN + 1) + DELAY_MIN);
}

/**
 * Simulates http request:
 * - response will be delayed by random time
 * - supports AbortSignal
 */
export function delayedResponse<Res>(apiFn: () => Res, abortSignal?: AbortSignal) {
  return new Promise<Res>((resolve, reject) => {
    if (abortSignal?.aborted) {
      return reject(new Error('canceled'));
    }
    setTimeout(() => {
      try {
        const result = apiFn();
        if (abortSignal?.aborted) {
          throw new Error('canceled');
        }
        return resolve(result);
      } catch (e) {
        const error = e instanceof Error ? e : new Error('Unexpected API error');
        reject(error);
      }
    }, randomDelay());
  });
}
