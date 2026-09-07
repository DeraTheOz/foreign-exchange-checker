export function formatRate(value: number): string {
  if (value >= 1000) {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(value);
  }
  if (value >= 100) return value.toFixed(2);
  return value.toFixed(4);
}

export function formatAxisDate(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00`);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  return `${month} ${day}`;
}

export function formatAxisYear(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00`);
  return String(date.getFullYear());
}

export function formatHeaderDate(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00`);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  return `${month} ${day}`;
}

export function formatTooltipDate(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00`);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}