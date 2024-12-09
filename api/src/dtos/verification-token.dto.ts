import { IsDate, IsEnum, IsString } from 'class-validator';
import { VerificationTokenType } from '@/core/enums/verification-token-type.enum';
import { BaseDto } from '@/dtos/base.dto';

export class VerificationTokenDto extends BaseDto {
  @IsString()
  token!: string;

  @IsEnum(VerificationTokenType)
  type!: VerificationTokenType;

  @IsDate()
  expiresAt!: Date;
}
