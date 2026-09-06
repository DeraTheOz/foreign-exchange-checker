import type { CSSProperties } from "react";
import { useRef, useEffect } from "react";
import { formatNumber } from "../../../lib/format-number";

interface AmountInputProps {
  label: string;
  value: string;
  readOnly?: boolean;
  onChange?: (raw: string) => void;
}

const MAX_INTEGER_DIGITS = 12;

function sanitizeAmountInput(value: string) {
  const sanitized = value.replace(/[^\d.]/g, "");
  const [integer = "", ...fractionParts] = sanitized.split(".");
  const cappedInteger = integer.slice(0, MAX_INTEGER_DIGITS);

  if (fractionParts.length === 0) return cappedInteger;

  return `${cappedInteger}.${fractionParts.join("")}`;
}

export function AmountInput({
  label,
  value,
  readOnly,
  onChange,
}: AmountInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorRef = useRef({ start: 0, end: 0 });

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.setSelectionRange(cursorRef.current.start, cursorRef.current.end);
  });

  const display = formatNumber(value);
  const inputWidth = `${Math.max(display.length, 1)}ch`;
  const textColor = readOnly ? "text-lime-500" : "text-neutral-50";

  return (
    <input
      ref={inputRef}
      inputMode="decimal"
      placeholder="0"
      readOnly={readOnly}
      aria-label={label}
      value={display}
      onChange={(event) => {
        cursorRef.current = {
          start: event.target.selectionStart ?? 0,
          end: event.target.selectionEnd ?? 0,
        };
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
