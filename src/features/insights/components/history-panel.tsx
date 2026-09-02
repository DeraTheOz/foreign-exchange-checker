import { EmptyState } from "../../../components/common/empty-state";

export function HistoryPanel() {
  return (
    <EmptyState
      title="No chart data available"
      description="We couldn't load rate history for USD/EUR right now. This usually clears up in a minute."
    />
  );
}
