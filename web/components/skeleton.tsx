import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number;
  loaderSize?: string;
  width?: string;
  height?: string;
}

export function SkeletonHeader({ className }: SkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Skeleton className="h-8 w-[300px]" />
      <Skeleton className="h-4 w-[600px]" />
    </div>
  );
}

export function SkeletonContent({
  className,
  rows = 20,
  width = 'w-full',
  height = 'h-4',
}: SkeletonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {[...Array(rows)].map((_, index) => (
        <Skeleton key={index} className={cn(height, width)} />
      ))}
    </div>
  );
}
