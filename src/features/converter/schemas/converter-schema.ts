import { z } from "zod";

export const converterSchema = z.object({
  amount: z
    .string()
    .min(1, "Enter an amount")
    .refine((value) => !Number.isNaN(Number(value)), "Must be a valid number"),
  from: z.string().min(1, "Select a currency"),
  to: z.string().min(1, "Select a currency"),
});

export const DEFAULT_CONVERTER_VALUES: ConverterFormValues = {
  amount: "",
  from: "USD",
  to: "EUR",
};

export type ConverterFormValues = z.infer<typeof converterSchema>;