import { Injectable, NotFoundException } from '@nestjs/common';
import type { Task, User, Prisma } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async getAllTasks(
    filterDto: GetTasksFilterDto,
    user: User,
  ): Promise<{ data: Task[]; total: number; page: number; limit: number }> {
    const { status, priority, search, page = 1, limit = 10 } = filterDto;

    // 1. กำหนดเงื่อนไขหลัก: ต้องเป็น Task ของ User คนนี้เท่านั้น
    const where: Prisma.TaskWhereInput = {
      userId: user.id,
    };

    // 2. ถ้าส่ง status มา ให้เพิ่มเงื่อนไข
    if (status) {
      where.status = status;
    }

    // 3. ถ้าส่ง priority มา ให้เพิ่มเงื่อนไข
    if (priority) {
      where.priority = priority;
    }

    // 4. ถ้าส่ง search มา ค้นหาใน title หรือ description (แบบ Case-Insensitive)
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 5. คำนวณ Skip สำหรับ Pagination
    const skip = (page - 1) * limit;

    // 6. ดึงข้อมูลแบบ Parallel (ดึงรายการ Task และนับจำนวนทั้งหมด)
    const [data, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.prisma.task.findUnique({
      where: { id, userId: user.id },
    });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

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