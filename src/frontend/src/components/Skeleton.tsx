interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`
        bg-gradient-to-r from-surface-elevated/60 via-surface-overlay/40 to-surface-elevated/60
        bg-[length:200%_100%]
        animate-shimmer
        rounded-lg
        ${className}
      `}
    />
  );
}

export function SkeletonText({ className = '' }: SkeletonProps) {
  return <Skeleton className={`h-4 ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-gradient-to-br from-surface-elevated/80 to-surface-card/80 rounded-2xl border border-white/[0.06] shadow-premium overflow-hidden">
      <Skeleton className="h-48 rounded-none" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <SkeletonText className="w-2/3" />
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>
        <SkeletonText className="w-1/3" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-10 flex-1 rounded-xl" />
          <Skeleton className="h-10 w-12 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="bg-gradient-to-br from-surface-elevated/80 to-surface-card/80 rounded-2xl border border-white/[0.06] shadow-premium p-6">
      <div className="flex items-center">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="ml-4 space-y-2 flex-1">
          <SkeletonText className="w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
}
