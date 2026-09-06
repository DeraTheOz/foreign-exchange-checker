export interface FrankfurterRate {
  date: string;
  base: string;
  quote: string;
  rate: number;
}

export interface FrankfurterCurrency {
  iso_code: string;
  name: string;
  symbol: string | null;
}

export interface FrankfurterError {
  message: string;
}
