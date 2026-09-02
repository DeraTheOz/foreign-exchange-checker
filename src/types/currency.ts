export interface Currency {
  code: string;
  name: string;
  flag: string;
}

export interface LiveRate {
  pair: string;
  value: string;
  change: string;
  direction: "up" | "down";
}
