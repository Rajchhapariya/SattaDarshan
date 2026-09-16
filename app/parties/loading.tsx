import { DirectoryListingSkeleton } from "@/components/skeletons/DirectoryListingSkeleton";

export default function PartiesDirectoryLoading() {
  return <DirectoryListingSkeleton title="Political Parties of India" cardType="party" count={9} />;
}
