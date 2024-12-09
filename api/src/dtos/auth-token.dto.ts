import { IsDate, IsString } from 'class-validator';
import { BaseDto } from '@/dtos/base.dto';

export class AuthTokenDto extends BaseDto {
  @IsString()
  accessToken!: string;

  @IsDate()
  accessTokenExpiresAt!: Date;

  @IsString()
  refreshToken!: string;

  @IsDate()
  refreshTokenExpiresAt!: Date;
}
