import { ResponseStatus } from '@/core/enums/response-status.enum';

export interface ResponsePayload {
  status?: ResponseStatus;
  code?: any;
  message?: any;
  data?: any;
  meta?: any;
  errors?: any;
  stack?: any;
  notify?: any;
  requestId?: any;
}
