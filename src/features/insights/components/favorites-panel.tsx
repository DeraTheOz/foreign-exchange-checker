import { EmptyState } from "../../../components/common/empty-state";

export function FavoritesPanel() {
  return (
    <EmptyState
      title="No pinned pairs yet"
      description="Pin a pair to track its rate here. Tap the star icon on any conversation or comparison row."
    />
  );
}
