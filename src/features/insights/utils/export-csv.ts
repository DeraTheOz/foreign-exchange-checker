import type { ConversionEntry } from "../store/conversion-history-store";

const HEADER = ["Timestamp", "From", "To", "Amount", "Converted"];

function escape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function downloadConversionCsv(entries: ConversionEntry[]): void {
  const rows = entries.map((entry) =>
    [
      new Date(entry.timestamp).toISOString(),
      entry.from,
      entry.to,
      entry.amount,
      entry.converted,
    ]
      .map(escape)
      .join(","),
  );

  const csv = `\uFEFF${[HEADER.join(","), ...rows].join("\n")}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `conversion-history-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}