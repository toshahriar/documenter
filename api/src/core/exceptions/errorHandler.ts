/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '@/core/enums/http-status.enum';
import { appConfig } from '@/config/app';
import { Logger } from '@/core/utils/logger';
import {
  ApplicationError,
  AuthenticationError,
  AuthorizationError,
  BadRequestError,
  DatabaseError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  RateLimitExceededError,
  ServiceUnavailableError,
  TooManyRequestsError,
  UnprocessableEntityError,
} from './';
import { ResponsePayload } from '@/core/interfaces/response-payload.interface';
import { ResponseStatus } from '@/core/enums/response-status.enum';
import { Responder } from '@/core/utils/responder';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): any => {
  let payload: ResponsePayload = {
    status: ResponseStatus.ERROR,
    code: HttpStatus.INTERNAL_SERVER_ERROR,
    message: err?.message ?? 'Internal Server Error',
    data: null,
    meta: null,
    errors: null,
    stack: appConfig.DEBUG ? err.stack : null,
    notify: true,
    ...(req.headers['x-request-id'] ? { requestId: String(req.headers['x-request-id']) } : {}),
  };

  switch (true) {
    case err instanceof ApplicationError:
    case err instanceof AuthenticationError:
    case err instanceof AuthorizationError:
    case err instanceof BadRequestError:
    case err instanceof DatabaseError:
    case err instanceof ForbiddenError:
    case err instanceof InternalServerError:
    case err instanceof NotFoundError:
    case err instanceof RateLimitExceededError:
    case err instanceof ServiceUnavailableError:
    case err instanceof TooManyRequestsError:
      payload = {
        ...payload,
        code: (err as any).code || HttpStatus.INTERNAL_SERVER_ERROR,
        errors: (err as any).errors || null,
        meta: (err as any).context || null,
      };
      break;

    case err instanceof UnprocessableEntityError:
      payload = {
        ...payload,
        code: (err as any).code || HttpStatus.INTERNAL_SERVER_ERROR,
        errors: (err as any).errors || null,
        meta: (err as any).context || null,
      };
      break;

    default:
      payload = {
        ...payload,
        message: err.message || 'Internal Server Error',
        code: (err as any).code || HttpStatus.INTERNAL_SERVER_ERROR,
      };
      break;
  }

  Logger.error(payload.message, err, payload);

  return new Responder(res)
    .requestId(payload.requestId)
    .status(payload.status as ResponseStatus)
    .code(payload.code)
    .message(payload.message)
    .errors(payload.errors)
    .stack(payload.stack)
    .notify(payload.notify)
    .send();
};

export default errorHandler;
