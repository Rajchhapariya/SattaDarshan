import { DirectoryListingSkeleton } from "@/components/skeletons/DirectoryListingSkeleton";

export default function StatesDirectoryLoading() {
  return <DirectoryListingSkeleton title="States & Union Territories" cardType="state" count={8} />;
}
