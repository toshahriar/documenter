import { HttpStatus } from '@/core/enums/http-status.enum';
import { HttpStatusMessage } from '@/core/constants/http-status-message.constant';

export class ApplicationError extends Error {
  constructor(
    public readonly context: string,
    message: string = 'Application Error',
    public readonly error: Error | null = null,
    public readonly code: number = HttpStatus.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.name = 'ApplicationError';
  }
}

export class AuthenticationError extends Error {
  constructor(
    public readonly context: string,
    message: string = HttpStatusMessage[HttpStatus.UNAUTHORIZED],
    public readonly error: Error | null = null,
    public readonly code: number = HttpStatus.UNAUTHORIZED
  ) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(
    public readonly context: string,
    message: string = HttpStatusMessage[HttpStatus.FORBIDDEN],
    public readonly error: Error | null = null,
    public readonly code: number = HttpStatus.FORBIDDEN
  ) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class BadRequestError extends Error {
  constructor(
    public readonly context: string,
    message: string = HttpStatusMessage[HttpStatus.BAD_REQUEST],
    public readonly error: Error | null = null,
    public readonly code: number = HttpStatus.BAD_REQUEST
  ) {
    super(message);
    this.name = 'BadRequestError';
  }
}

export class DatabaseError extends Error {
  constructor(
    public readonly context: string,
    message: string = HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR],
    public readonly error: Error | null = null,

    public readonly code: number = HttpStatus.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class ForbiddenError extends Error {
  constructor(
    public readonly context: string,
    message: string = HttpStatusMessage[HttpStatus.FORBIDDEN],
    public readonly error: Error | null = null,

    public readonly code: number = HttpStatus.FORBIDDEN
  ) {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class InternalServerError extends Error {
  constructor(
    public readonly context: string,
    message: string = HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR],
    public readonly error: Error | null = null,

    public readonly code: number = HttpStatus.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.name = 'InternalServerError';
  }
}

export class NotFoundError extends Error {
  constructor(
    public readonly context: string,
    message: string = HttpStatusMessage[HttpStatus.NOT_FOUND],
    public readonly error: Error | null = null,

    public readonly code: number = HttpStatus.NOT_FOUND
  ) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class RateLimitExceededError extends Error {
  constructor(
    public readonly context: string,
    message: string = HttpStatusMessage[HttpStatus.TOO_MANY_REQUESTS],
    public readonly error: Error | null = null,

    public readonly code: number = HttpStatus.TOO_MANY_REQUESTS
  ) {
    super(message);
    this.name = 'RateLimitExceededError';
  }
}

export class ServiceUnavailableError extends Error {
  constructor(
    public readonly context: string,
    message: string = HttpStatusMessage[HttpStatus.SERVICE_UNAVAILABLE],
    public readonly error: Error | null = null,

    public readonly code: number = HttpStatus.SERVICE_UNAVAILABLE
  ) {
    super(message);
    this.name = 'ServiceUnavailableError';
  }
}

export class TooManyRequestsError extends Error {
  constructor(
    public readonly context: string,
    message: string = HttpStatusMessage[HttpStatus.TOO_MANY_REQUESTS],
    public readonly error: Error | null = null,

    public readonly code: number = HttpStatus.TOO_MANY_REQUESTS
  ) {
    super(message);
    this.name = 'TooManyRequestsError';
  }
}

export class UnprocessableEntityError extends Error {
  constructor(
    public readonly context: string,
    message: string = HttpStatusMessage[HttpStatus.UNPROCESSABLE_ENTITY],
    public readonly errors: Record<string, unknown> | null = null,
    public readonly code: number = HttpStatus.UNPROCESSABLE_ENTITY
  ) {
    super(message);
    this.name = 'UnprocessableEntityError';
  }
}
