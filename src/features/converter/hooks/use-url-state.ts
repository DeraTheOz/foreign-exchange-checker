import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { CURRENCY_CODES } from "../../../lib/constants";
import { useConverterStore } from "../store/converter-store";

const VALID_CODES = new Set(CURRENCY_CODES);

const DEFAULT_TO = "EUR";
const FALLBACK_TO = "USD";

function normalizeCode(value: string | null): string | null {
  if (!value) return null;
  const code = value.toUpperCase();
  return VALID_CODES.has(code) ? code : null;
}

function distinctTo(to: string, from: string): string {
  return to === from ? (to === DEFAULT_TO ? FALLBACK_TO : DEFAULT_TO) : to;
}

export function useUrlState() {
  const from = useConverterStore((state) => state.from);
  const to = useConverterStore((state) => state.to);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialized = useRef(false);

  useEffect(() => {
    let nextFrom = from;
    let nextTo = to;

    if (!initialized.current) {
      const urlFrom = normalizeCode(searchParams.get("from"));
      const urlTo = normalizeCode(searchParams.get("to"));

      nextFrom = urlFrom ?? from;
      nextTo = distinctTo(urlTo ?? to, nextFrom);
      initialized.current = true;
    }

    if (nextFrom !== from || nextTo !== to) {
      useConverterStore.setState({ from: nextFrom, to: nextTo });
    }

    if (searchParams.get("from") !== nextFrom || searchParams.get("to") !== nextTo) {
      const params = new URLSearchParams(searchParams);
      params.set("from", nextFrom);
      params.set("to", nextTo);
      setSearchParams(params, { replace: true });
    }
  }, [from, to, searchParams, setSearchParams]);
}