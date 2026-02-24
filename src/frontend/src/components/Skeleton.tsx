import { Skeleton as UISkeleton } from '@/components/ui/skeleton';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <UISkeleton className={className} />;
}

export function SkeletonText({ className = '' }: SkeletonProps) {
  return <UISkeleton className={`h-4 ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <UISkeleton className="h-48 rounded-none" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-start">
          <UISkeleton className="h-4 w-2/3" />
          <UISkeleton className="h-6 w-20 rounded-full" />
        </div>
        <UISkeleton className="h-4 w-1/3" />
        <div className="flex gap-2 pt-2">
          <UISkeleton className="h-10 flex-1 rounded-lg" />
          <UISkeleton className="h-10 w-12 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-center">
        <UISkeleton className="h-12 w-12 rounded-xl" />
        <div className="ml-4 space-y-2 flex-1">
          <UISkeleton className="h-3 w-20" />
          <UISkeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
}
