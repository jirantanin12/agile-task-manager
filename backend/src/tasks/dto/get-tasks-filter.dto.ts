import { IsEnum, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus, TaskPriority } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetTasksFilterDto {
  @ApiPropertyOptional({ enum: TaskStatus, description: 'กรองตามสถานะ Task' })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: TaskPriority, description: 'กรองตามระดับความสำคัญ' })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({ description: 'ค้นหาด้วยคำใน title หรือ description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 1, description: 'ลำดับหน้าที่ต้องการดึงข้อมูล' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'จำนวนรายการต่อหน้า' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}