'use client';

import { useEffect } from 'react';
import { Activity, AlertTriangle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { dashboardInit } from '@/app/admin/dashboard/_store/slice';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function Dashboard() {
  const dispatch = useAppDispatch();
  const docusignStatus = useAppSelector(
    (state: any) => state.me.data?.docusign?.status ?? undefined
  );
  const { data } = useAppSelector((state: any) => state.dashboard);

  useEffect(() => {
    dispatch(dashboardInit(null));
  }, []);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.total ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.total_sent ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Signed</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.total_signed ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Declined</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.total_declined ?? 0}</div>
          </CardContent>
        </Card>
      </div>
      {docusignStatus !== undefined && !docusignStatus && (
        <div className="mt-6">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              <CardTitle className="text-lg font-medium text-yellow-700">
                Connection Warning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700">
                Your account is not connected to the DocuSign. Please connect to enable feature.
              </p>
            </CardContent>
            <CardFooter>
              <a
                href="/api/v1/docusign/auth"
                className="
                    inline-block px-6 py-3 text-sm font-medium leading-6
                    text-white bg-yellow-500 rounded-lg shadow
                    hover:bg-yellow-600 hover:shadow-lg focus:outline-none
                    focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all"
              >
                Connect Now
              </a>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
