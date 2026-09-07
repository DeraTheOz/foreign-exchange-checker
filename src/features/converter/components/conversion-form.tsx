import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  converterSchema,
  DEFAULT_CONVERTER_VALUES,
  type ConverterFormValues,
} from "../schemas/converter-schema";
import { useConversion } from "../hooks/use-conversion";
import { useConversionActions } from "../hooks/use-conversion-actions";
import { CurrencyPanel } from "./currency-panel";
import { SwapButton } from "./swap-button";
import { ActionButtons } from "./action-buttons";
import { useConverterStore } from "../store/converter-store";

export function ConversionForm() {
  const form = useForm<ConverterFormValues>({
    resolver: zodResolver(converterSchema),
    defaultValues: DEFAULT_CONVERTER_VALUES,
  });

  const amount = useConverterStore((s) => s.amount);
  const setAmount = useConverterStore((s) => s.setAmount);
  const from = useConverterStore((s) => s.from);
  const to = useConverterStore((s) => s.to);
  const swapPair = useConverterStore((s) => s.swap);

  useEffect(() => {
    form.setValue("from", from);
  }, [from, form]);

  useEffect(() => {
    form.setValue("to", to);
  }, [to, form]);

  const { convertedAmount, rateString, staleAgeLabel, isLoading, error } =
    useConversion(from, to, amount);

  const { isFavorited, isLogged, handleFavorite, handleLog } =
    useConversionActions({ from, to, amount, convertedAmount });

  const handleAmountChange = (raw: string) => {
    setAmount(raw);
    form.setValue("amount", raw);
  };

  const swap = () => {
    swapPair();
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

      <div className="flex flex-col items-center gap-3 px-6 py-4 border-t border-dashed border-neutral-400 sm:flex-row">
        <div className="flex min-w-0 flex-col gap-1 sm:mr-auto">
          <p className="m-0 min-w-0 text-xs leading-tight tracking-widest text-neutral-50">
            {isLoading ? (
              <span className="text-neutral-400">Loading rate…</span>
            ) : error && !staleAgeLabel ? (
              <span className="text-error">Unable to fetch rate</span>
            ) : (
              rateString
            )}
          </p>
          {staleAgeLabel ? (
            <p className="m-0 text-xs leading-tight tracking-widest text-neutral-200">
              {staleAgeLabel}
            </p>
          ) : null}
        </div>
        <ActionButtons
          isFavorited={isFavorited}
          isLogged={isLogged}
          onFavorite={handleFavorite}
          onLog={handleLog}
        />
      </div>
    </form>
  );
}
