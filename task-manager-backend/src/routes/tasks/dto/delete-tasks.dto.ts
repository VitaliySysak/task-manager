import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class DeleteTasksDto {
  @ApiProperty({
    type: [String],
    required: true,
    example: ['47def093-af97-4676-b38f-ffd062913bac', 'ec7cd315-fbe6-4256-93b6-83787abcf3c3'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  @Type(() => String)
  ids: string[];
}
