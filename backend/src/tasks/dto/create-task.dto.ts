import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TaskPriority } from '../task.model';

export class CreateTaskDto {
  @IsNotEmpty({ message: 'title ห้ามเป็นค่าว่าง' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'description ห้ามเป็นค่าว่าง' })
  @IsString()
  description: string;

  @IsEnum(TaskPriority, { message: 'priority ต้องเป็น LOW, MEDIUM หรือ HIGH เท่านั้น' })
  priority: TaskPriority;
}