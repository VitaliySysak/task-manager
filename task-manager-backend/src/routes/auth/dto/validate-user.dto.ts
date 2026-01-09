import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ValidateUserDto {
  @ApiProperty({ type: String, required: true })
  @IsUUID()
  userId: string;
}
