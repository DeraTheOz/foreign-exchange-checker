import { ArrowRightLeft } from "lucide-react";

interface SwapButtonProps {
  onClick: () => void;
}

export function SwapButton({ onClick }: SwapButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Swap currencies"
      className="grid h-12 w-12 shrink-0 place-items-center justify-self-center rounded-lg border border-neutral-500 bg-neutral-600 text-neutral-50">
      <ArrowRightLeft className="h-5 w-5" />
    </button>
  );
}
