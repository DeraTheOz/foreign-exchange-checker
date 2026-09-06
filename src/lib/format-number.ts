const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 20,
});

export function formatNumber(value: number | string): string {
  if (value === "") return "";

  if (typeof value === "string" && value.includes(".")) {
    const [integer = "", fraction = ""] = value.split(".");
    const numericInteger = Number(integer || 0);
    if (Number.isNaN(numericInteger)) return "";

    return `${formatter.format(numericInteger)}.${fraction}`;
  }

  const numeric = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(numeric)) return "";
  if (numeric < 1000) return String(numeric);

  const formatted = formatter.format(numeric);
  if (formatted.includes("e")) {
    return numeric.toLocaleString("en-US", {
      maximumFractionDigits: 0,
    });
  }
  return formatted;
}
