import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  converterSchema,
  DEFAULT_CONVERTER_VALUES,
  type ConverterFormValues,
} from "../schemas/converter-schema";
import { useExchangeRate } from "../hooks/use-exchange-rate";
import { formatNumber } from "../../../lib/format-number";
import { CurrencyPanel } from "./currency-panel";
import { SwapButton } from "./swap-button";
import { ActionButtons } from "./action-buttons";

const MAX_DECIMALS = 6;

function roundConverted(value: number, decimals: number): string {
  const factor = 10 ** decimals;
  return String(Math.round(value * factor) / factor);
}

export function ConversionForm() {
  const form = useForm<ConverterFormValues>({
    resolver: zodResolver(converterSchema),
    defaultValues: DEFAULT_CONVERTER_VALUES,
  });

  const [amount, setAmount] = useState("");

  const from = useWatch({ control: form.control, name: "from" });
  const to = useWatch({ control: form.control, name: "to" });

  const { data: rateData, isLoading, error } = useExchangeRate(from, to);

  const rate = rateData?.rate ?? 1;

  const convertedAmount = useMemo(() => {
    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || amount === "") return "";
    return roundConverted(numericAmount * rate, MAX_DECIMALS);
  }, [amount, rate]);

  const rateString = useMemo(() => {
    if (from === to) return `1 ${from} = 1 ${to}`;
    return `1 ${from} = ${formatNumber(rate)} ${to}`;
  }, [from, to, rate]);

  const handleAmountChange = (raw: string) => {
    setAmount(raw);
    form.setValue("amount", raw);
  };

  const swap = () => {
    const { from: f, to: t } = form.getValues();
    form.setValue("from", t);
    form.setValue("to", f);
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
          value={convertedAmount}
          form={form}
          readOnly
        />
      </div>

      <div className="flex flex-col items-center gap-5 px-6 py-4 border-t border-dashed border-neutral-400 sm:flex-row">
        <p className="m-0 min-w-0 text-xs leading-tight tracking-widest text-neutral-50 sm:mr-auto">
          {isLoading ? (
            <span className="text-neutral-400">Loading rate…</span>
          ) : error ? (
            <span className="text-error">Unable to fetch rate</span>
          ) : (
            rateString
          )}
        </p>
        <ActionButtons onFavorite={() => {}} onLog={() => {}} />
      </div>
    </form>
  );
}
