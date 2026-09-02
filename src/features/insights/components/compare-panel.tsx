import { EmptyState } from "../../../components/common/empty-state";

export function ComparePanel() {
  return (
    <EmptyState
      title="No comparison available"
      description="Enter an amount in SEND above to see what your money is worth in other currencies."
    />
  );
}
