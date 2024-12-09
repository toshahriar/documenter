import { Response } from 'express';
import { ResponseStatus } from '@/core/enums/response-status.enum';
import { ResponsePayload } from '@/core/interfaces/response-payload.interface';
import { generateToken } from '@/core/utils/common';

export class Responder {
  private payload: ResponsePayload = {
    status: ResponseStatus.SUCCESS,
    code: 200,
    message: 'Operation successful',
    data: null,
    meta: null,
    errors: null,
    stack: null,
    notify: false,
    requestId: generateToken(),
  };

  constructor(private readonly res: Response) {}

  status(value: ResponseStatus): this {
    this.payload.status = value;
    return this;
  }

  code(value: string | number): this {
    this.payload.code = value;
    return this;
  }

  message(value: string): this {
    this.payload.message = value;
    return this;
  }

  data(value: object | any[]): this {
    this.payload.data = value;
    return this;
  }

  meta(value: object): this {
    this.payload.meta = value;
    return this;
  }

  errors(value: object): this {
    this.payload.errors = value;
    return this;
  }

  stack(value: any): this {
    this.payload.stack = value;
    return this;
  }

  notify(value: boolean = true): this {
    this.payload.notify = value;
    return this;
  }

  requestId(value: any): this {
    this.payload.requestId = value;
    return this;
  }

  send(statusCode: number = 200): Response {
    return this.res.status(this.payload.code ?? statusCode).json(this.payload);
  }
}
