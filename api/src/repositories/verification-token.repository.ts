import { FindOptionsWhere, LessThan, MoreThan } from 'typeorm';
import { BaseRepository } from '@/repositories/base.repository';
import { DatabaseProvider } from '@/providers/database.provider';
import { VerificationToken } from '@/entities/verification-token.entity';
import { VerificationTokenType } from '@/core/enums/verification-token-type.enum';
import { generateToken } from '@/core/utils/common';
import { Logger } from '@/core/utils/logger';

export class VerificationTokenRepository extends BaseRepository {
  constructor() {
    super(DatabaseProvider.getInstance(), VerificationToken);
  }

  async findValidToken(
    token: string,
    type: VerificationTokenType,
    userId: string
  ): Promise<VerificationToken | null> {
    const where: FindOptionsWhere<VerificationToken> = {
      token,
      type,
      userId,
      expiresAt: MoreThan(new Date()),
    };

    return this.findBy({ where });
  }

  async createToken(
    userId: string,
    type: VerificationTokenType,
    expiresAt: Date
  ): Promise<VerificationToken> {
    const tokenData = {
      token: generateToken(userId),
      type,
      userId,
      expiresAt,
    };

    return this.save(tokenData);
  }

  async revokeToken(userId: string, type: VerificationTokenType): Promise<void> {
    try {
      await this.update({ where: { userId, type } }, { isRevoked: true });
    } catch (error: unknown) {
      Logger.error((error as Error).message, error as Error);
    }
  }

  async deleteExpiredTokens(): Promise<void> {
    await this.delete({
      where: {
        expiresAt: LessThan(new Date()),
      },
    });
  }
}
