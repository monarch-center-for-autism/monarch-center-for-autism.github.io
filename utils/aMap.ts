export async function aMap<T, U>(
  array: T[],
  func: (T) => Promise<U>
): Promise<U[]> {
  return await Promise.all(array.map(func));
}

export async function aFlatMap<T, U>(
  array: T[],
  func: (T) => Promise<U[]>
): Promise<U[]> {
  return (await aMap(array, func)).flat();
}
