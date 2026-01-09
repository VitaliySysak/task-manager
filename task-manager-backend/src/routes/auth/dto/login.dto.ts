import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, IsEmail, IsOptional } from 'class-validator';

import { AuthResponseDto, AuthReturnDto } from './auth.dto';

export class LoginDto {
  @ApiProperty({ type: String, required: true, example: 'user@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, required: true, example: '12345678' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class GoogleLoginDto {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  fullName?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({ type: String, required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  password: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  providerId: string;
}

export class LoginReturnDto extends AuthReturnDto {}
export class LoginResponseDto extends AuthResponseDto {}
