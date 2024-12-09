import { PageSection } from '@/components/page-section';
import { Document } from '@/app/admin/document/_components/Document';

export default function DocumentPage() {
  return (
    <PageSection
      title="Documents"
      subtitle="Easily manage your documents, collaborate, and streamline the signing process."
    >
      <Document />
    </PageSection>
  );
}
