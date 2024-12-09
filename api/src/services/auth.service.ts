import { AuthTokenService } from '@/services/access-token.service';
import { JWTService } from '@/services/jwt.service';
import { User } from '@/entities/user.entity';
import { appConfig } from '@/config/app';
import { BadRequestError } from '@/core/exceptions';
import { TokenPair } from '@/core/interfaces/token-pair.interface';
import { omitProperties } from '@/core/utils/common';
import { UserService } from '@/services/user.service';

export class AuthService {
  constructor(
    private readonly tokenService: AuthTokenService = new AuthTokenService(),
    private readonly jwtService: JWTService = new JWTService(),
    private readonly userService: UserService = new UserService()
  ) {}

  async authToken(
    identifier: string,
    password: string
  ): Promise<{ tokens: TokenPair; user: Omit<User, string> }> {
    const user = await this.userService.findUserByEmailOrUsername(identifier);
    if (!user) {
      throw new BadRequestError(AuthService.name, 'User not found');
    }

    const passwordMatches = await user.comparePassword(password);
    if (!passwordMatches) {
      throw new BadRequestError(AuthService.name, 'Invalid password');
    }

    const tokens = this.jwtService.generateTokenPair({
      sub: user.id,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      },
    });

    await this.tokenService.createToken(
      user.id,
      tokens.accessToken,
      new Date(Date.now() + appConfig.ACCESS_TOKEN_EXPIRY),
      tokens.refreshToken,
      new Date(Date.now() + appConfig.REFRESH_TOKEN_EXPIRY)
    );

    const data = omitProperties(user, ['password']);

    return { user: data, tokens };
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    const decodedToken = this.jwtService.verifyRefreshToken(refreshToken);
    const existingRefreshToken = await this.tokenService.findRefreshToken(
      refreshToken,
      decodedToken.sub
    );

    if (!existingRefreshToken || existingRefreshToken.isRevoked) {
      throw new BadRequestError(AuthService.name, 'Invalid refresh token');
    }

    const tokens = this.jwtService.generateTokenPair({
      sub: decodedToken.sub,
      user: decodedToken.user,
    });

    await this.tokenService.updateAccessToken(
      existingRefreshToken.id,
      tokens.accessToken,
      new Date(Date.now() + appConfig.ACCESS_TOKEN_EXPIRY)
    );

    return tokens;
  }
}
