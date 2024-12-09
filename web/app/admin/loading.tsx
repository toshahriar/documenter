import { SkeletonContent, SkeletonHeader } from '@/components/skeleton';

export default function AppLayoutLoading() {
  return (
    <div className="space-y-6">
      <SkeletonHeader />
      <SkeletonContent rows={20} />
    </div>
  );
}
