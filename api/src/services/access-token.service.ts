import { AccessTokenRepository } from '@/repositories/auth-token.repository';
import { AuthToken } from '@/entities/auth-token.entity';
import { AuthTokenType } from '@/core/enums/auth-token-type.enum';
import { NotFoundError } from '@/core/exceptions';

export class AuthTokenService {
  constructor(
    private readonly tokenRepository: AccessTokenRepository = new AccessTokenRepository()
  ) {}

  async findRefreshToken(token: string, userId?: string): Promise<AuthToken | null> {
    return this.tokenRepository.findValidRefreshToken(token, userId);
  }

  async revokeToken(token: string, type: AuthTokenType = AuthTokenType.ACCESS): Promise<AuthToken> {
    return this.tokenRepository.revokeToken(token, type);
  }

  async createToken(
    userId: string,
    accessToken: string,
    accessTokenExpiresAt: Date,
    refreshToken: string,
    refreshTokenExpiresAt: Date
  ): Promise<AuthToken> {
    return this.tokenRepository.save({
      userId,
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
      isRevoked: false,
    });
  }

  async updateAccessToken(
    id: string,
    accessToken: string,
    accessTokenExpiresAt: Date
  ): Promise<AuthToken> {
    const token = await this.tokenRepository.findBy({ where: { id } });

    if (!token) {
      throw new NotFoundError(AuthTokenService.name, 'Refresh token not found');
    }

    token.accessToken = accessToken;
    token.accessTokenExpiresAt = accessTokenExpiresAt;

    return this.tokenRepository.save(token);
  }
}
