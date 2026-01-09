import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
  Query,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';
import { Task } from '@prisma/client';

import { Status, StatusResponse } from '@/@types/response';
import { UserRequest } from '@/@types/user';
import { AuthGuard } from '@/guards/auth.guard';
import { CreateGoogleTaskDataDto, CreateTaskDto } from '@/routes/tasks/dto/create-task.dto';
import { DeleteTasksDto } from '@/routes/tasks/dto/delete-tasks.dto';
import { FindTasksQueryDto } from '@/routes/tasks/dto/find-task.dto';
import { UpdateTaskDto } from '@/routes/tasks/dto/update-task.dto';

import { TasksService } from './tasks.service';

@Controller({ path: '/tasks' })
export class TasksController {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly tasksService: TasksService) {}

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Get('/')
  async getAll(@Req() req: UserRequest, @Query() query: FindTasksQueryDto): Promise<Task[]> {
    try {
      const { user } = req;

      const userTasks = await this.tasksService.getAll(user, query);

      return userTasks;
    } catch (error) {
      this.logger.error('getAll:', error.stack);
      throw new InternalServerErrorException();
    }
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Get(':taskId')
  async getOne(@Param('taskId') taskId: string, @Req() req: UserRequest): Promise<Task> {
    try {
      const { user } = req;

      const getTask = await this.tasksService.getOne(user, taskId);

      return getTask;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      this.logger.error('getOne:', error.stack);
      throw new InternalServerErrorException();
    }
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Post('/')
  async create(@Body() body: CreateTaskDto, @Req() req: UserRequest): Promise<Task> {
    try {
      const { user } = req;

      const task = await this.tasksService.create(body, user);

      return task;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else {
        this.logger.error('create:', error.stack);
        throw new InternalServerErrorException();
      }
    }
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Put(':taskId')
  async update(@Req() req: UserRequest, @Param('taskId') taskId: string, @Body() body: UpdateTaskDto): Promise<Task> {
    try {
      const user = req.user;

      const task = await this.tasksService.update(user, taskId, body);

      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      this.logger.error('update:', error.stack);
      throw new InternalServerErrorException();
    }
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Delete(':taskId')
  async delete(@Req() req: UserRequest, @Param('taskId') taskId: string): Promise<Task> {
    try {
      const user = req.user;

      const task = await this.tasksService.delete(user, taskId);

      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      this.logger.error('delete:', error.stack);
      throw new InternalServerErrorException();
    }
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Post('/delete-many')
  async deleteCompleted(@Req() req: UserRequest, @Body() body: DeleteTasksDto): Promise<StatusResponse> {
    try {
      const user = req.user;

      await this.tasksService.deleteCompleted(user, body);

      return { status: Status.success };
    } catch (error) {
      this.logger.error('deleteCompleted:', error.stack);
      throw new InternalServerErrorException();
    }
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Post('/create-event')
  async createWithGoogleEvent(@Req() req: UserRequest, @Body() body: CreateGoogleTaskDataDto): Promise<Task> {
    try {
      const { user } = req;

      const task = await this.tasksService.createWithGoogleEvent(user, body);

      return task;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else {
        this.logger.error('createWithGoogleEvent:', error.stack);
        throw new InternalServerErrorException();
      }
    }
  }
}
