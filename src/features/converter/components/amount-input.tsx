import type { CSSProperties } from "react";
import { formatNumber } from "../../../lib/format-number";

interface AmountInputProps {
  label: string;
  value: string;
  readOnly?: boolean;
  onChange?: (raw: string) => void;
}

function sanitizeAmountInput(value: string) {
  const sanitized = value.replace(/[^\d.]/g, "");
  const [integer = "", ...fractionParts] = sanitized.split(".");

  if (fractionParts.length === 0) return integer;

  return `${integer}.${fractionParts.join("")}`;
}

export function AmountInput({
  label,
  value,
  readOnly,
  onChange,
}: AmountInputProps) {
  const display = formatNumber(value);
  const inputWidth = `${Math.max(display.length, 1)}ch`;
  const textColor = readOnly ? "text-lime-500" : "text-neutral-50";

  return (
    <input
      inputMode="decimal"
      placeholder="0"
      readOnly={readOnly}
      aria-label={label}
      value={display}
      onChange={(event) => {
        const raw = sanitizeAmountInput(event.target.value);
        onChange?.(raw);
      }}
      style={
        {
          "--amount-input-width": inputWidth,
        } as CSSProperties
      }
      className={`h-10 min-w-[min(100%,var(--amount-input-width))] flex-[999_1_var(--amount-input-width)] rounded-md border-0 border-b border-neutral-600 bg-transparent pb-px text-4xl font-bold leading-none ${textColor} placeholder:text-neutral-200 max-[520px]:text-[36px]`}
    />
  );
}
