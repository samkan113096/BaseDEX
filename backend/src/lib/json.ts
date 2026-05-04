/** Serialize to JSON handling BigInt by converting to string */
export function toJSON(value: unknown): string {
  return JSON.stringify(value, (_key, val) =>
    typeof val === 'bigint' ? val.toString() : val
  );
}
