import { useEffect, useId, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useWatch } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import type { ConverterFormValues } from "../schemas/converter-schema";
import { CurrencyPicker } from "./currency-picker";
import { useConverterStore } from "../store/converter-store";
import { Flag } from "./flag";

interface CurrencySelectProps {
  field: "from" | "to";
  form: UseFormReturn<ConverterFormValues>;
}

export function CurrencySelect({ field, form }: CurrencySelectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const open = useConverterStore((s) => s.pickerTarget) === field;
  const setPickerTarget = useConverterStore((s) => s.setPickerTarget);
  const closePicker = useConverterStore((s) => s.closePicker);

  const selected = useWatch({ control: form.control, name: field });
  const setFrom = useConverterStore((s) => s.setFrom);
  const setTo = useConverterStore((s) => s.setTo);

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        closePicker();
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePicker();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, closePicker]);

  const selectCurrency = (code: string) => {
    form.setValue(field, code);
    if (field === "from") {
      setFrom(code);
    } else {
      setTo(code);
    }
    closePicker();
  };

  const togglePicker = () => {
    if (open) {
      closePicker();
    } else {
      setPickerTarget(field);
    }
  };

  return (
    <div ref={containerRef} className="relative min-w-24 flex-[1_0_6rem]">
      <button
        type="button"
        onClick={togglePicker}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={field}
        className="flex h-10 w-full min-w-24 cursor-pointer items-center justify-center gap-2 rounded-lg border border-neutral-400 bg-neutral-500 text-sm leading-tight tracking-widest text-neutral-50 focus-visible:outline-2 focus-visible:outline-primary">
        <Flag code={selected} />
        <span>{selected}</span>
        <ChevronDown size={12} fill="#fff" aria-hidden />
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-50 mt-1 w-max max-w-[calc(100vw-2rem)]">
          <CurrencyPicker
            listId={listId}
            selectedCode={selected}
            onSelect={selectCurrency}
          />
        </div>
      ) : null}
    </div>
  );
}
