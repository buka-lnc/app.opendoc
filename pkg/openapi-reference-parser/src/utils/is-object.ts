// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isObject(value: unknown): value is Exclude<object, null | Array<any>> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}
