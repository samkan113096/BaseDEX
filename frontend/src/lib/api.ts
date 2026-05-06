/**
 * Returns the full URL for an API path.
 * If NEXT_PUBLIC_API_URL is set, prepends it (external backend mode).
 * If empty (Netlify / no separate backend), returns the path as-is
 * so the Next.js API routes at /api/* are used directly.
 */
const RAW = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');

export function apiPath(path: string): string {
  return RAW ? `${RAW}${path}` : path;
}
