import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CalendarDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  googleCalendarRefreshToken: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  googleCalendarAccessToken: string;
}
