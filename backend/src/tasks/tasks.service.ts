import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '@prisma/client'; // เปลี่ยนไปใช้ Type จาก @prisma/client
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  // Inject PrismaService เข้ามาใช้งานผ่าน Constructor
  constructor(private prisma: PrismaService) {}

  async getAllTasks(): Promise<Task[]> {
    return this.prisma.task.findMany({
      orderBy: { createdAt: 'desc' }, // เรียงลำดับจากใหม่ไปเก่า
    });
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description, priority } = createTaskDto;

    return this.prisma.task.create({
      data: {
        title,
        description,
        priority,
        // status และ createdAt จะถูกใส่ค่า Default ให้อัตโนมัติใน DB
      },
    });
  }

  async updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    // เช็กก่อนว่ามี Task นี้อยู่ในระบบจริงไหม
    await this.getTaskById(id);

    return this.prisma.task.update({
      where: { id },
      data: {
        status: updateTaskStatusDto.status,
      },
    });
  }

  async deleteTask(id: string): Promise<void> {
    // เช็กก่อนว่ามี Task นี้อยู่ในระบบจริงไหม
    await this.getTaskById(id);

    await this.prisma.task.delete({
      where: { id },
    });
  }
}