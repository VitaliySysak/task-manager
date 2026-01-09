import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AuthReturnDto {
  @ApiProperty({ type: String, required: true })
  @IsUUID()
  refreshToken: string;

  @ApiProperty({ type: String, required: true })
  @IsUUID()
  accessToken: string;
}

export class AuthResponseDto {
  @ApiProperty({ type: String, required: true })
  @IsUUID()
  accessToken: string;
}
