import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { Task, User } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth() // ระบุว่าต้องใช้ Bearer Token ในการยิง Endpoints เหล่านี้
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @ApiOperation({ summary: 'ดึงรายการ Task ทั้งหมดพร้อม Search, Filtering และ Pagination' })
  @Get()
  getAllTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<{ data: Task[]; total: number; page: number; limit: number }> {
    return this.tasksService.getAllTasks(filterDto, user);
  }

  @ApiOperation({ summary: 'ดึงข้อมูล Task รายตัวด้วย ID' })
  @Get(':id')
  getTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @ApiOperation({ summary: 'สร้าง Task ใหม่' })
  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @ApiOperation({ summary: 'อัปเดตสถานะของ Task' })
  @Patch(':id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, updateTaskStatusDto, user);
  }

  @ApiOperation({ summary: 'ลบ Task ออกจากระบบ' })
  @Delete(':id')
  deleteTask(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }
}