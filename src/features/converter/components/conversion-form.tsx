import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  converterSchema,
  DEFAULT_CONVERTER_VALUES,
  type ConverterFormValues,
} from "../schemas/converter-schema";
import { CurrencyPanel } from "./currency-panel";
import { SwapButton } from "./swap-button";
import { ActionButtons } from "./action-buttons";

interface ConversionFormProps {
  rate?: string;
}

export function ConversionForm({
  rate = "1 USD = 0.8530 EUR",
}: ConversionFormProps) {
  const form = useForm<ConverterFormValues>({
    resolver: zodResolver(converterSchema),
    defaultValues: DEFAULT_CONVERTER_VALUES,
  });

  const [amount, setAmount] = useState("");

  const handleAmountChange = (raw: string) => {
    setAmount(raw);
    form.setValue("amount", raw);
  };

  const swap = () => {
    const { from, to } = form.getValues();
    form.setValue("from", to);
    form.setValue("to", from);
  };

  return (
    <form
      className="rounded-[20px] bg-neutral-700 shadow-[0_12px_40px_rgb(0_0_0/0.4)]"
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit(() => {})();
      }}>
      <div className="grid grid-cols-1 gap-3 items-center sm:grid-cols-[minmax(0,1fr)_48px_minmax(0,1fr)] sm:gap-6 p-5">
        <CurrencyPanel
          label="SEND"
          field="from"
          value={amount}
          form={form}
          onChange={handleAmountChange}
        />
        <SwapButton onClick={swap} />
        <CurrencyPanel
          label="RECEIVE"
          field="to"
          value={amount}
          form={form}
          readOnly
        />
      </div>

      <div className="flex flex-col items-center gap-5 px-6 py-4 border-t border-dashed border-neutral-400 sm:flex-row">
        <p className="m-0 min-w-0 text-xs leading-tight tracking-widest text-neutral-50 sm:mr-auto">
          {rate}
        </p>
        <ActionButtons onFavorite={() => {}} onLog={() => {}} />
      </div>
    </form>
  );
}
