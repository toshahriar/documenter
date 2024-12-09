import { PageSection } from '@/components/page-section';
import { Integration } from '@/app/admin/integration/_components/Integration';

export default function IntegrationPage() {
  return (
    <PageSection
      title="Integrations"
      subtitle="Connect with tools like DocuSign, Slack, or Jira to streamline your workflow."
    >
      <Integration />
    </PageSection>
  );
}
