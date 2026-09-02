import { EmptyState } from "../../../components/common/empty-state";

export function LogPanel() {
  return (
    <EmptyState
      title="No conversions logged yet"
      description="Every conversion is recorded here automatically when you tap LOG CONVERSION. Your log is private to this session and this browser."
    />
  );
}
