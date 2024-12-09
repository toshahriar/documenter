import jwt from 'jsonwebtoken';
import { appConfig } from '@/config/app';
import { AuthTokenType } from '@/core/enums/auth-token-type.enum';
import { TokenPayload } from '@/core/interfaces/token-payload.interface';
import { TokenPair } from '@/core/interfaces/token-pair.interface';
import { BadRequestError, InternalServerError } from '@/core/exceptions';

export class JWTService {
  constructor() {
    if (!appConfig.JWT_SECRET) {
      throw new InternalServerError(JWTService.name, 'JWT_SECRET is required');
    }
  }

  private generateToken(
    payload: Omit<TokenPayload, 'type'>,
    type: AuthTokenType,
    expiresIn: number
  ): string {
    return jwt.sign({ ...payload, type }, appConfig.JWT_SECRET, { expiresIn });
  }

  private verifyToken(token: string, expectedType: AuthTokenType): TokenPayload {
    try {
      const decoded = jwt.verify(token, appConfig.JWT_SECRET) as TokenPayload;

      if (decoded.type !== expectedType) {
        throw new BadRequestError(JWTService.name, 'Invalid token type');
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new BadRequestError(JWTService.name, `${expectedType} token expired`, error);
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new BadRequestError(JWTService.name, `Invalid ${expectedType} token`, error);
      }

      throw error;
    }
  }

  public generateAccessToken(payload: Omit<TokenPayload, 'type'>): string {
    return this.generateToken(payload, AuthTokenType.ACCESS, appConfig.ACCESS_TOKEN_EXPIRY);
  }

  public generateRefreshToken(payload: Omit<TokenPayload, 'type'>): string {
    return this.generateToken(payload, AuthTokenType.REFRESH, appConfig.REFRESH_TOKEN_EXPIRY);
  }

  public verifyAccessToken(token: string): TokenPayload {
    return this.verifyToken(token, AuthTokenType.ACCESS);
  }

  public verifyRefreshToken(token: string): TokenPayload {
    return this.verifyToken(token, AuthTokenType.REFRESH);
  }

  public decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch (error: unknown) {
      throw new InternalServerError(
        JWTService.name,
        `Error decoding token: ${(error as Error).message}`,
        error as Error
      );
    }
  }

  public generateTokenPair(payload: Omit<TokenPayload, 'type'>): TokenPair {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }
}
