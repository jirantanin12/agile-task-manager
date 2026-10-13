import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TaskPriority } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implement JWT Auth', description: 'หัวข้อ Task' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Secure tasks endpoint with Passport Guard', description: 'รายละเอียด Task' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ enum: TaskPriority, example: TaskPriority.HIGH, description: 'ระดับความสำคัญ' })
  @IsEnum(TaskPriority)
  priority: TaskPriority;
}