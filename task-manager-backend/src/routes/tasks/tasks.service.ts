import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Task } from '@prisma/client';
import { TaskStatus } from '@prisma/client';
import axios from 'axios';

import { PublicUser } from '@/@types/user';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateGoogleTaskDataDto, CreateTaskDto } from '@/routes/tasks/dto/create-task.dto';

import { DeleteTasksDto } from './dto/delete-tasks.dto';
import { FindTasksQueryDto } from './dto/find-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(user: PublicUser, query: FindTasksQueryDto): Promise<Task[]> {
    const { title, description, status } = query;

    const tasks = this.prisma.task.findMany({
      where: {
        userId: user.id,
        status,
        title: title ? { contains: title, mode: 'insensitive' } : undefined,
        description: description ? { contains: description, mode: 'insensitive' } : undefined,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return tasks;
  }

  async getOne(user: PublicUser, taskId: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId, userId: user.id },
    });

    if (!task) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }
    return task;
  }

  async create(newTask: CreateTaskDto, user: PublicUser): Promise<Task> {
    const { title, description, status, priority } = newTask;

    const isTaskExist = await this.prisma.task.findFirst({
      where: {
        title,
        userId: user.id,
      },
    });

    if (isTaskExist) {
      throw new ConflictException(`Task with title ${title} already exists`);
    }

    const task = await this.prisma.task.create({
      data: {
        title,
        description: description ?? '',
        status: status,
        priority,
        userId: user.id,
      },
    });

    return task;
  }

  async update(user: PublicUser, taskId: string, updateTask: Partial<Task>): Promise<Task> {
    const isTaskExist = await this.prisma.task.findUnique({ where: { id: taskId, userId: user.id } });

    if (!isTaskExist) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }

    const achivement = await this.prisma.achivement.findUnique({ where: { userId: user.id } });

    if (!achivement) {
      throw new NotFoundException(`User achivements does not found`);
    }

    if (achivement.completeSteak >= 3) {
      await this.prisma.achivement.update({
        where: {
          userId: user.id,
        },
        data: {
          completeSteak: 0,
        },
      });
    }

    const task = await this.prisma.task.update({ where: { id: taskId }, data: updateTask });

    return task;
  }

  async delete(user: PublicUser, taskId: string): Promise<Task> {
    const isTaskExist = await this.prisma.task.findUnique({ where: { id: taskId, userId: user.id } });

    if (!isTaskExist) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }

    const task = await this.prisma.task.delete({ where: { id: taskId } });

    return task;
  }

  async deleteCompleted(user: PublicUser, body: DeleteTasksDto): Promise<void> {
    const { ids } = body;

    await this.prisma.task.deleteMany({
      where: {
        id: { in: ids },
        userId: user.id,
      },
    });
  }

  async createWithGoogleEvent(user: PublicUser, taskData: CreateGoogleTaskDataDto): Promise<Task> {
    const { title, description, isCompleted, startEventTime, endEventTime } = taskData.newTask;

    const isTaskExist = await this.prisma.task.findFirst({
      where: {
        title,
        userId: user.id,
      },
    });

    if (isTaskExist) {
      throw new ConflictException(`Task with title ${title} already exists`);
    }

    const task = await this.prisma.task.create({
      data: {
        title,
        description: description ?? '',
        status: isCompleted ? TaskStatus.DONE : TaskStatus.TODO,
        userId: user.id,
      },
    });

    const now = new Date();
    const defaultStartTime = new Date(now.getTime() + 60 * 60 * 1000);
    const defaultEndTime = new Date(now.getTime() + 120 * 60 * 1000);

    const defaultStandartEndTime = startEventTime
      ? new Date(startEventTime.getTime() + 60 * 60 * 1000)
      : defaultEndTime;

    const googleResponse = await axios.post(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        summary: title,
        description,
        start: {
          dateTime: (startEventTime ?? defaultStartTime).toISOString(),
        },
        end: {
          dateTime: (endEventTime ?? defaultStandartEndTime).toISOString(),
        },
      },
      {
        headers: { Authorization: `Bearer ${taskData.googleAccessToken}` },
      },
    );

    if (googleResponse.status !== 200) {
      throw new InternalServerErrorException('Error while creating google task');
    }

    return task;
  }
}
