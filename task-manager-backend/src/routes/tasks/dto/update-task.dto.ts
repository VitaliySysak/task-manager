import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';
import { IsString, IsEnum, IsOptional } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus, enumName: 'TaskStatus' })
  @IsEnum(TaskStatus, { message: 'Status must be TODO or DONE' })
  @IsOptional()
  status?: TaskStatus;
}
