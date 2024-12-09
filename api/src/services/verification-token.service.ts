import { VerificationToken } from '@/entities/verification-token.entity';
import { VerificationTokenRepository } from '@/repositories/verification-token.repository';
import { appConfig } from '@/config/app';
import { VerificationTokenType } from '@/core/enums/verification-token-type.enum';
import { NotFoundError } from '@/core/exceptions';

export class VerificationTokenService {
  constructor(
    private tokenRepository: VerificationTokenRepository = new VerificationTokenRepository()
  ) {}

  async createEmailVerificationToken(userId: string): Promise<VerificationToken> {
    return this.tokenRepository.createToken(
      userId,
      VerificationTokenType.EMAIL_VERIFICATION,
      new Date(Date.now() + appConfig.EMAIL_VERIFICATION_TOKEN_EXPIRY)
    );
  }

  async createPasswordResetToken(userId: string): Promise<VerificationToken> {
    return this.tokenRepository.createToken(
      userId,
      VerificationTokenType.PASSWORD_RESET,
      new Date(Date.now() + appConfig.PASSWORD_RESET_TOKEN_EXPIRY)
    );
  }

  async findEmailVerificationToken(token: string, userId: string): Promise<VerificationToken> {
    const verificationToken = await this.tokenRepository.findValidToken(
      token,
      VerificationTokenType.EMAIL_VERIFICATION,
      userId
    );

    if (!verificationToken) {
      throw new NotFoundError(VerificationTokenService.name, 'Verification token not found');
    }

    return verificationToken;
  }

  async findPasswordResetToken(token: string, userId: string): Promise<VerificationToken> {
    const verificationToken = await this.tokenRepository.findValidToken(
      token,
      VerificationTokenType.PASSWORD_RESET,
      userId
    );

    if (!verificationToken) {
      throw new NotFoundError(VerificationTokenService.name, 'Verification token not found');
    }

    return verificationToken;
  }

  async revokeEmailVerificationToken(userId: string): Promise<void> {
    return this.tokenRepository.revokeToken(userId, VerificationTokenType.EMAIL_VERIFICATION);
  }

  async revokePasswordResetToken(userId: string): Promise<void> {
    return this.tokenRepository.revokeToken(userId, VerificationTokenType.PASSWORD_RESET);
  }
}
