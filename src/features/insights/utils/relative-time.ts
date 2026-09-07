export function relativeTime(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return "NOW";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}M`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}H`;

  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  return `${day} ${month}`;
}