import { Request, Response } from 'express';
import { appConfig } from '@/config/app';
import { Responder } from '@/core/utils/responder';
import { ResponseStatus } from '@/core/enums/response-status.enum';
import { HttpStatus } from '@/core/enums/http-status.enum';

export class AppController {
  index = async (req: Request, res: Response): Promise<Response> => {
    const data = {
      name: appConfig.NAME,
      env: appConfig.ENV,
      debug: appConfig.DEBUG,
    };

    return new Responder(res)
      .status(ResponseStatus.SUCCESS)
      .code(HttpStatus.OK)
      .message('Application is running!')
      .data(data)
      .send();
  };
}
