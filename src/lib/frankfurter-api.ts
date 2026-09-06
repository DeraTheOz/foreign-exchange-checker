import type { FrankfurterCurrency, FrankfurterRate } from "../types/frankfurter";

const BASE_URL = "https://api.frankfurter.dev/v2";

export class FrankfurterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FrankfurterError";
  }
}

async function request<T>(path: string): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url);

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message =
      body && typeof body === "object" && "message" in body
        ? String(body.message)
        : `Request failed: ${response.status}`;
    throw new FrankfurterError(message);
  }

  return response.json() as Promise<T>;
}

export function fetchLatestRate(
  base: string,
  quote: string,
  date?: string,
): Promise<FrankfurterRate> {
  const params = date ? `?date=${date}` : "";
  return request<FrankfurterRate>(`/rate/${base}/${quote}${params}`);
}

export function fetchRates(base: string, quotes: string[]): Promise<FrankfurterRate[]> {
  const params = new URLSearchParams({ base, quotes: quotes.join(",") });
  return request<FrankfurterRate[]>(`/rates?${params}`);
}

export function fetchHistoricalRates(
  base: string,
  quote: string,
  from: string,
  to: string,
): Promise<FrankfurterRate[]> {
  const params = new URLSearchParams({ base, quotes: quote, from, to });
  return request<FrankfurterRate[]>(`/rates?${params}`);
}

export function fetchCurrencies(): Promise<FrankfurterCurrency[]> {
  return request<FrankfurterCurrency[]>("/currencies");
}
