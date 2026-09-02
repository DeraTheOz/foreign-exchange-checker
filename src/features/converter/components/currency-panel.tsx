import type { UseFormReturn } from "react-hook-form";
import type { ConverterFormValues } from "../schemas/converter-schema";
import { AmountInput } from "./amount-input";
import { CurrencySelect } from "./currency-select";

interface CurrencyPanelProps {
  label: string;
  field: "from" | "to";
  value: string;
  form: UseFormReturn<ConverterFormValues>;
  readOnly?: boolean;
  onChange?: (raw: string) => void;
}

export function CurrencyPanel({
  label,
  field,
  value,
  form,
  readOnly,
  onChange,
}: CurrencyPanelProps) {
  return (
    <div className="flex min-w-0 flex-[1_1_20rem] flex-col justify-end gap-5 rounded-2xl border border-neutral-500 bg-neutral-600 p-4 min-[520px]:p-5">
      <p className="m-0 text-sm leading-tight tracking-widest text-neutral-100">
        {label}
      </p>
      <div className="flex min-w-0 flex-wrap items-center gap-4">
        <AmountInput
          label={label}
          value={value}
          readOnly={readOnly}
          onChange={onChange}
        />
        <CurrencySelect field={field} form={form} />
      </div>
    </div>
  );
}
