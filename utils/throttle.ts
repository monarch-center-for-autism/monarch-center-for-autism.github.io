import throttledQueue from "throttled-queue";

const _throttle = throttledQueue(100, 1000);

export default function throttle<T>(func: () => Promise<T>): Promise<T> {
  return new Promise((resolve) => {
    _throttle(function () {
      func().then(resolve);
    });
  });
}
