'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function DocumentDetail({ data }: any) {
  return (
    <div className="w-full mx-auto">
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>{data.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Attachment</h3>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <dt className="font-medium">File Name:</dt>
                  <dd>{data?.metadata?.attachment?.fileName ?? 'N/A'}</dd>
                  <dt className="font-medium">File Path:</dt>
                  <dd>{data?.metadata?.attachment?.filePath ?? 'N/A'}</dd>
                  <dt className="font-medium">File Size:</dt>
                  <dd>{data?.metadata?.attachment?.fileSize ?? 'N/A'} bytes</dd>
                  <dt className="font-medium">File Extension:</dt>
                  <dd>{data?.metadata?.attachment?.fileExt ?? 'N/A'}</dd>
                </dl>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Document Status</h3>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <dt className="font-medium">Status:</dt>
                  <dd>{data.metadata.status}</dd>
                  <dt className="font-medium">Envelope ID:</dt>
                  <dd>{data.metadata.envelopeId}</dd>
                  <dt className="font-medium">Status Date:</dt>
                  <dd>{data.metadata.statusDateTime}</dd>
                </dl>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Signers</h3>
                <ul className="space-y-2">
                  {data?.signers?.map((signer: any) => (
                    <li key={signer.id} className="flex justify-between items-center pb-2">
                      <span>
                        {signer.name} ({signer.email})
                      </span>
                      <Badge variant={signer.status === 'pending' ? 'secondary' : 'default'}>
                        {signer.status}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {data?.activities?.map((activity: any) => (
                  <li key={activity.id} className="border-b pb-4">
                    <p>{activity.metadata.message}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Created At: {activity.createdAt}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
