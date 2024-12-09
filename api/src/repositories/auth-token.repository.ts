import { MoreThan, LessThan, FindOptionsWhere } from 'typeorm';
import { BaseRepository } from '@/repositories/base.repository';
import { DatabaseProvider } from '@/providers/database.provider';
import { AuthToken } from '@/entities/auth-token.entity';
import { AuthTokenType } from '@/core/enums/auth-token-type.enum';

export class AccessTokenRepository extends BaseRepository {
  constructor() {
    super(DatabaseProvider.getInstance(), AuthToken);
  }

  async findValidRefreshToken(refreshToken: string, userId?: string): Promise<AuthToken | null> {
    const now = new Date();

    const where: FindOptionsWhere<AuthToken> = {
      refreshToken,
      isRevoked: false,
      refreshTokenExpiresAt: MoreThan(now),
    };

    if (userId) {
      where.userId = userId;
    }

    return this.findBy({ where });
  }

  async revokeToken(token: string, type: AuthTokenType = AuthTokenType.ACCESS): Promise<AuthToken> {
    const condition =
      type === AuthTokenType.ACCESS ? { accessToken: token } : { refreshToken: token };

    return this.update({ where: condition }, { isRevoked: true });
  }
}
