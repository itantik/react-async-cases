export function waitPlease(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), timeout);
  });
}
