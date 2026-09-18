import type { CSSProperties } from "react";
import { useLayoutEffect, useRef } from "react";
import { formatNumber } from "../../../lib/format-number";
import { sanitizeAmountInput } from "../utils/amount";

interface AmountInputProps {
  label: string;
  value: string;
  readOnly?: boolean;
  onChange?: (raw: string) => void;
}

export function AmountInput({
  label,
  value,
  readOnly,
  onChange,
}: AmountInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const digitsBeforeCaret = useRef<number | null>(null);

  useLayoutEffect(() => {
    const el = inputRef.current;
    const target = digitsBeforeCaret.current;
    if (!el || target === null) return;
    let caret = 0;
    for (let seen = 0; caret < el.value.length && seen < target; caret++) {
      if (/[\d.]/.test(el.value[caret])) seen++;
    }
    el.setSelectionRange(caret, caret);
    digitsBeforeCaret.current = null;
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
        const { value: raw, selectionStart } = event.target;
        digitsBeforeCaret.current = raw
          .slice(0, selectionStart ?? raw.length)
          .replace(/[^\d.]/g, "").length;
        onChange?.(sanitizeAmountInput(raw));
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
