import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Priority, TaskStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, ValidateNested, IsDate, IsEnum } from 'class-validator';
import { IsBoolean, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus, enumName: 'TaskStatus' })
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Status must be TODO or DONE' })
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: Priority, enumName: 'Priority' })
  @IsOptional()
  @IsEnum(Priority, { message: 'Status must be either LOW, MEDIUM, HIGHT, CRITICAL' })
  priority?: Priority;
}

export class CreateGoogleTaskDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: Boolean })
  @IsNotEmpty()
  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;

  @ApiProperty({ type: Date })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startEventTime?: Date;

  @ApiProperty({ type: Date })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endEventTime?: Date;
}

export class CreateGoogleTaskDataDto {
  @ApiProperty({ type: () => CreateGoogleTaskDto })
  @ValidateNested()
  @Type(() => CreateGoogleTaskDto)
  newTask: CreateGoogleTaskDto;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  googleAccessToken: string;
}
