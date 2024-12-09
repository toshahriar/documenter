import { PageSection } from '@/components/page-section';
import { ProfileUpdateForm } from '@/app/admin/profile/_components/ProfileUpdateForm';
import { ProfileCard } from '@/app/admin/profile/_components/ProfileCard';

export default function ProfilePage() {
  return (
    <PageSection title="Profile" subtitle="Manage your personal information and account settings.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
        <div className="md:col-span-1">
          <ProfileCard />
        </div>
        <div className="md:col-span-2">
          <ProfileUpdateForm />
        </div>
      </div>
    </PageSection>
  );
}
