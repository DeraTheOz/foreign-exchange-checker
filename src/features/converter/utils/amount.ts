export const MAX_INTEGER_DIGITS = 12;
export const MAX_DECIMALS = 6;

export function sanitizeAmountInput(value: string): string {
  const sanitized = value.replace(/[^\d.]/g, "");
  const [integer = "", ...fractionParts] = sanitized.split(".");
  const cappedInteger = integer.slice(0, MAX_INTEGER_DIGITS);

  if (fractionParts.length === 0) return cappedInteger;

  return `${cappedInteger}.${fractionParts.join("")}`;
}

export function roundConverted(value: number, decimals: number): string {
  const factor = 10 ** decimals;
  return String(Math.round(value * factor) / factor);
}