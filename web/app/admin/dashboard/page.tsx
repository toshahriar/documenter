import { PageSection } from '@/components/page-section';
import { Dashboard } from '@/app/admin/dashboard/_components/Dashboard';

export default function DashboardPage() {
  return (
    <PageSection
      title="Dashboard"
      subtitle="Your business dashboard and overview.Here's an overview of your dashboard"
    >
      <Dashboard />
    </PageSection>
  );
}
