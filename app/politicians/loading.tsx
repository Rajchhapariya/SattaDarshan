import { DirectoryListingSkeleton } from "@/components/skeletons/DirectoryListingSkeleton";

export default function PoliticiansDirectoryLoading() {
  return <DirectoryListingSkeleton title="Representatives & Leaders" cardType="grid" count={12} />;
}
