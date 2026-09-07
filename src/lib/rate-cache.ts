export interface CachedRate {
  rate: number;
  cachedAt: number;
}

const PREFIX = "fx-rate:";

export function readCachedRate(base: string, quote: string): CachedRate | null {
  try {
    const raw = localStorage.getItem(`${PREFIX}${base}:${quote}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const record = parsed as Record<string, unknown>;
    if (
      typeof record.rate !== "number" ||
      typeof record.cachedAt !== "number"
    ) {
      return null;
    }
    return { rate: record.rate, cachedAt: record.cachedAt };
  } catch {
    return null;
  }
}

export function writeCachedRate(
  base: string,
  quote: string,
  rate: number,
): void {
  try {
    localStorage.setItem(
      `${PREFIX}${base}:${quote}`,
      JSON.stringify({ rate, cachedAt: Date.now() }),
    );
  } catch {
    // Storage unavailable; nothing to fall back to.
  }
}

export function formatStaleness(cachedAt: number): string {
  const minutes = Math.max(0, Math.floor((Date.now() - cachedAt) / 60_000));
  if (minutes < 1) return "a moment ago";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
