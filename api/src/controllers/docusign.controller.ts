import { Request, Response } from 'express';
import { DocusignService } from '@/services/docusign.service';
import { Responder } from '@/core/utils/responder';
import { HttpStatus } from '@/core/enums/http-status.enum';
import { ResponseStatus } from '@/core/enums/response-status.enum';
import { BadRequestError } from '@/core/exceptions';
import { DocusignIntegrationService } from '@/services/docusign-integration.service';
import { DocusignIntegration } from '@/entities/docusign-integration.entity';
import queryString from 'query-string';
import { appConfig } from '@/config/app';
import { Logger } from '@/core/utils/logger';

export class DocusignController {
  constructor(
    private docusignService: DocusignService = new DocusignService(),
    private docusignIntegrationService: DocusignIntegrationService = new DocusignIntegrationService()
  ) {}

  auth = async (req: Request, res: Response): Promise<any> => {
    try {
      const docusignAuthUrl = this.docusignService.generateAuthUrl(
        `${appConfig.API_URL}/v1/docusign/auth/callback`,
        req.user.id
      );

      if (!docusignAuthUrl) {
        Logger.error(`Invalid DocuSign Auth URL: ${docusignAuthUrl}`);
        return res.status(500).json({ message: 'Failed to generate authentication URL.' });
      }

      Logger.error(`Redirecting to DocuSign Auth URL: ${docusignAuthUrl}`);
      return res.redirect(docusignAuthUrl);
    } catch (error: unknown) {
      Logger.error('Error during authentication redirection:', error as Error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  };

  authCallback = async (req: Request, res: Response): Promise<void> => {
    const hashFragment = req.originalUrl.split('?')[1];
    if (hashFragment) {
      const payload: any = queryString.parse(hashFragment);
      const data: Partial<DocusignIntegration> = {
        userId: payload.state,
        metadata: payload,
      };
      await this.docusignIntegrationService.saveOrUpdate(payload.state, data);
      return res.redirect('/admin/dashboard');
    } else {
      throw new BadRequestError('DocuSign authentication failed');
    }
  };

  webhook = async (req: Request, res: Response): Promise<Response> => {
    // Need to implement this feature
    console.log(req.body);

    return new Responder(res)
      .status(ResponseStatus.SUCCESS)
      .code(HttpStatus.OK)
      .message('Web hook api called!')
      .notify()
      .send();
  };
}
