import { useCallback } from "react";
import { useFavoritesStore } from "../../insights/store/favorites-store";
import { useConversionHistory } from "../../insights/store/conversion-history-store";
import { formatNumber } from "../../../lib/format-number";

interface UseConversionActionsParams {
  from: string;
  to: string;
  amount: string;
  convertedAmount: string;
}

export function useConversionActions({
  from,
  to,
  amount,
  convertedAmount,
}: UseConversionActionsParams) {
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorited = useFavoritesStore((s) =>
    s.isFavorited({ from, to }),
  );

  const addLogEntry = useConversionHistory((s) => s.addEntry);
  const formattedAmount = formatNumber(amount);
  const isLogged = useConversionHistory((s) =>
    convertedAmount !== "" ? s.isLogged(from, to, formattedAmount) : false,
  );

  const handleFavorite = useCallback(() => {
    toggleFavorite({ from, to });
  }, [toggleFavorite, from, to]);

  const handleLog = useCallback(() => {
    if (convertedAmount === "" || isLogged) return;
    addLogEntry({
      from,
      to,
      amount: formattedAmount,
      converted: formatNumber(convertedAmount),
    });
  }, [from, to, formattedAmount, convertedAmount, isLogged, addLogEntry]);

  return { isFavorited, isLogged, handleFavorite, handleLog };
}