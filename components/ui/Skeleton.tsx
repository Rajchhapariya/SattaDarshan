type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) { return <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`}/>; }