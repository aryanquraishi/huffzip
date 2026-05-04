/**
 * Format milliseconds to human-readable time
 * 1240 → "1.2s"
 */
export function formatTime(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}
