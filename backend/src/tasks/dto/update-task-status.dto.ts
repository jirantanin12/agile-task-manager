import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task.model';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus, { message: 'status ต้องเป็น TODO, IN_PROGRESS หรือ DONE เท่านั้น' })
  status: TaskStatus;
}