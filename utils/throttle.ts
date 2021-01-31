import throttledQueue from "throttled-queue";

// const _throttle = throttledQueue(75, 1000, true);
const _throttle = throttledQueue(75, 1000);

export default function throttle<T>(func: () => Promise<T>): Promise<T> {
  return new Promise((resolve) => {
    _throttle(function () {
      func().then(resolve);
    });
  });
}
