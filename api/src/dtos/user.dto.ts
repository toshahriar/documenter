import { IsEmail, IsString, MinLength, IsStrongPassword, IsOptional } from 'class-validator';
import { BaseDto } from '@/dtos/base.dto';
import { Expose } from 'class-transformer';

export class UserDto extends BaseDto {
  @IsString()
  @MinLength(3)
  firstName!: string;

  @IsString()
  @MinLength(3)
  lastName!: string;

  @IsString()
  @MinLength(3)
  username!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 0,
    minNumbers: 0,
    minSymbols: 0,
    minUppercase: 0,
  })
  @Expose({ toClassOnly: true })
  password!: string;

  @IsOptional()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 0,
    minNumbers: 0,
    minSymbols: 0,
    minUppercase: 0,
  })
  @Expose({ toClassOnly: true })
  confirmPassword!: string;
}
