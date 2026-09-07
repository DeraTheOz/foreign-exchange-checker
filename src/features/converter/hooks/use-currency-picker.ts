import { useMemo, useState } from "react";
import { useCurrencies } from "./use-currencies";

const POPULAR_CODES = ["USD", "EUR", "GBP"];

export function useCurrencyPicker() {
  const [search, setSearch] = useState("");
  const { data: currencies, isLoading } = useCurrencies();

  const filteredCurrencies = useMemo(() => {
    if (!currencies) return [];
    const query = search.trim().toLowerCase();
    if (!query) return currencies;

    return currencies.filter((currency) => {
      return (
        currency.code.toLowerCase().includes(query) ||
        currency.name.toLowerCase().includes(query)
      );
    });
  }, [currencies, search]);

  const popularCurrencies = useMemo(
    () => filteredCurrencies.filter((currency) => POPULAR_CODES.includes(currency.code)),
    [filteredCurrencies],
  );

  const otherCurrencies = useMemo(
    () => filteredCurrencies.filter((currency) => !POPULAR_CODES.includes(currency.code)),
    [filteredCurrencies],
  );

  return {
    search,
    setSearch,
    isLoading,
    filteredCurrencies,
    popularCurrencies,
    otherCurrencies,
  };
}