import { docusignConfig } from '@/config/docusign';
import * as queryString from 'node:querystring';
import { BadRequestError } from '@/core/exceptions';
import { RedisService } from '@/services/redis.service';
import { FileService } from '@/services/file.service';
import { Logger } from '@/core/utils/logger';
import docusign from 'docusign-esign';

export class DocusignService {
  constructor(
    private readonly apiClient: docusign.ApiClient = new docusign.ApiClient(),
    private readonly fileService: FileService = new FileService(),
    private readonly redisService: RedisService = new RedisService()
  ) {
    this.apiClient.setOAuthBasePath(docusignConfig.DS_OAUTH_BASE_PATH);
    this.apiClient.setBasePath(docusignConfig.DS_BASE_PATH);
  }

  private async initializeAuthHeader(): Promise<void> {
    const { accessToken } = await this.getToken();
    this.apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`);
  }

  public generateAuthUrl(
    redirectUri: string,
    state?: string,
    scope: string = 'signature+impersonation'
  ): string {
    return `https://${docusignConfig.DS_OAUTH_BASE_PATH}/oauth/auth?${queryString.stringify({
      response_type: 'code',
      scope,
      client_id: docusignConfig.DS_CLIENT_ID,
      redirect_uri: redirectUri,
      state,
    })}`;
  }

  public async getToken(): Promise<{ accessToken: string; tokenExpiration: number }> {
    const cachedData = await this.redisService.get('dsAuth');
    let data: { accessToken: string; tokenExpiration: number } | null = cachedData
      ? JSON.parse(cachedData)
      : null;

    if (!data) {
      const privateKey = Buffer.from(docusignConfig.DS_PRIVATE_KEY, 'utf-8');
      const tokenLifeTime = 10 * 60;

      const results = await this.apiClient.requestJWTUserToken(
        docusignConfig.DS_CLIENT_ID,
        docusignConfig.DS_IMPERSONATED_USER_GUID,
        ['signature'],
        privateKey,
        tokenLifeTime
      );

      const accessToken = results.body.access_token;
      const currentTime = Math.floor(Date.now() / 1000);
      const tokenExpiration = currentTime + tokenLifeTime * 60;

      data = { accessToken, tokenExpiration };

      await this.redisService.set('dsAuth', JSON.stringify(data), tokenExpiration);
    }

    return data;
  }

  public async sendEnvelope(data: any): Promise<any> {
    try {
      await this.initializeAuthHeader();

      const { filePath } = data.metadata.attachment;
      const docBase64 = await this.fileService.getBase64(filePath);

      const document = (docusign as any).Document.constructFromObject({
        documentBase64: docBase64,
        documentId: '1',
        fileExtension: 'pdf',
        name: data.title,
      });

      const signers = data.signers.map((signer: any, index: any) => {
        const signHere = (docusign as any).SignHere.constructFromObject({
          documentId: '1',
          pageNumber: '1',
          xPosition: '50',
          yPosition: `${50 + index * 50}`,
          tabLabel: `SignHere${index + 1}`,
        });

        return (docusign as any).Signer.constructFromObject({
          email: signer.email,
          name: signer.name,
          recipientId: signer.id,
          routingOrder: `${signer.order}`,
          tabs: (docusign as any).Tabs.constructFromObject({
            signHereTabs: [signHere],
          }),
        });
      });

      const recipients = (docusign as any).Recipients.constructFromObject({
        signers,
      });

      const envelopeDefinition = (docusign as any).EnvelopeDefinition.constructFromObject({
        emailSubject: `Please sign the document: ${data.title}`,
        documents: [document],
        recipients,
        status: 'sent',
      });

      const envelopesApi = new (docusign as any).EnvelopesApi(this.apiClient);
      const accountId = docusignConfig.DS_APP_ID;

      return await envelopesApi.createEnvelope(accountId, {
        envelopeDefinition,
      });
    } catch (err: unknown) {
      await this.redisService.delete('dsAuth');
      throw new BadRequestError((err as Error).message);
    }
  }
}
