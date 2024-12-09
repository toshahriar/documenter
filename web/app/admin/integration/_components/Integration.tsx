'use client';

import { useEffect, useState } from 'react';
import { FileText, Mail, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useAppSelector } from '@/redux/hooks';

function IntegrationCard({ name, description, icon: Icon, connected, upcoming, link }: any) {
  return (
    <Card className="w-full p-6 shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-6 w-6 text-primary" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">{name}</h3>
            <p className="text-xs text-gray-600">{description}</p>
          </div>
        </div>
        {!connected && link ? (
          <a
            href={link}
            className={`min-w-[100px] text-gray-950 text-sm px-4 py-2 text-center rounded-md ${
              upcoming
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-white border border-gray-300 text-blue-600 hover:bg-gray-100'
            }`}
          >
            {upcoming ? 'Upcoming' : 'Connect'}
          </a>
        ) : (
          <span
            className={`min-w-[100px] text-gray-950 text-sm px-4 py-2 text-center rounded-md ${
              connected
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-200 text-gray-950 cursor-not-allowed'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            aria-disabled="true"
          >
            {connected ? 'Connected' : 'Upcoming'}
          </span>
        )}
      </div>
    </Card>
  );
}

export function Integration() {
  const docusignStatus = useAppSelector((state: any) => !!state.me.data?.docusign?.status);
  const [docusignState, setDocusignState] = useState({
    connected: false,
    link: '/api/v1/docusign/auth',
    upcoming: false,
  });
  const [gmailState] = useState({ connected: false, link: '', upcoming: true });
  const [teamsState] = useState({
    connected: false,
    link: '',
    upcoming: true,
  });

  useEffect(() => {
    setDocusignState({ ...docusignState, connected: docusignStatus });
  }, [docusignStatus]);

  return (
    <>
      <IntegrationCard
        name="DocuSign"
        description="Sign documents electronically"
        icon={FileText}
        connected={docusignState.connected}
        upcoming={docusignState.upcoming}
        link={docusignState.link}
      />
      <IntegrationCard
        name="Gmail"
        description="Connect your Gmail account"
        icon={Mail}
        connected={gmailState.connected}
        upcoming={gmailState.upcoming}
        link={gmailState.link}
      />
      <IntegrationCard
        name="Teams"
        description="Connect with Microsoft Teams"
        icon={MessageSquare}
        connected={teamsState.connected}
        upcoming={teamsState.upcoming}
        link={teamsState.link}
      />
    </>
  );
}
