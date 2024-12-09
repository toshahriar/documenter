import { AuthTokenType } from '@/core/enums/auth-token-type.enum';

export interface TokenPayload {
  sub: string;
  email: string;
  type: AuthTokenType;
  exp: number;
  [key: string]: unknown;
}
