import { z } from "zod";
import { CURRENCIES } from "../../../lib/constants";

const currencyCodes = CURRENCIES.map((currency) => currency.code) as [
  string,
  ...string[],
];

export const converterSchema = z.object({
  amount: z
    .string()
    .min(1, "Enter an amount")
    .refine((value) => !Number.isNaN(Number(value)), "Must be a valid number"),
  from: z.enum(currencyCodes),
  to: z.enum(currencyCodes),
});

export const DEFAULT_CONVERTER_VALUES: ConverterFormValues = {
  amount: "",
  from: "USD",
  to: "EUR",
};

export type ConverterFormValues = z.infer<typeof converterSchema>;
