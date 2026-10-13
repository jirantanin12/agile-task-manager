import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, User } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  // ดึงเฉพาะ Task ของ User คนที่ล็อกอินอยู่
  async getAllTasks(user: User): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ดึง Task ตาม ID โดยต้องเป็นของ User คนนี้ด้วย
  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.prisma.task.findUnique({
      where: { id, userId: user.id },
    });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  // สร้าง Task และผูก userId ของคนล็อกอิน
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description, priority } = createTaskDto;

    return this.prisma.task.create({
      data: {
        title,
        description,
        priority,
        userId: user.id,
      },
    });
  }

  async updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
    user: User,
  ): Promise<Task> {
    await this.getTaskById(id, user);

    return this.prisma.task.update({
      where: { id },
      data: {
        status: updateTaskStatusDto.status,
      },
    });
  }

  async deleteTask(id: string, user: User): Promise<void> {
    await this.getTaskById(id, user);

    await this.prisma.task.delete({
      where: { id },
    });
  }
}