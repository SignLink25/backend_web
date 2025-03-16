import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    try {
      const task = this.taskRepository.create(createTaskDto);
      return await this.taskRepository.save(task);
    } catch (error) {
      throw new Error(error.detail);
    }
  }

  async findAll({ limit = 10, offset = 0 }: PaginationDto) {
    const [data, totalResults] = await this.taskRepository.findAndCount({
      take: limit,
      skip: offset * limit,
      relations: ['lesson', 'media', 'progress'], // Relaciones agregadas
    });

    if (!data.length || totalResults === 0) {
      throw new NotFoundException(`No se encontraron tareas.`);
    }

    return { limit, offset, partialResults: data.length, totalResults, data };
  }

  async findOne(id: string) {
    let task: Task;
    if (isUUID(id)) {
      task = await this.taskRepository.findOne({
        where: { id },
        relations: ['lesson', 'media', 'progress'], // Relaciones agregadas
      });
    }

    if (!task) {
      throw new NotFoundException(
        `No se encontró ninguna tarea con el ID: ${id}`,
      );
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    try {
      const task = await this.taskRepository.findOneBy({ id });

      if (!task) {
        throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
      }

      if (Object.keys(updateTaskDto).length === 0) {
        return task;
      }

      await this.taskRepository.update(id, updateTaskDto);
      return this.taskRepository.findOne({
        where: { id },
        relations: ['lesson', 'media', 'progress'],
      });
    } catch (error) {
      throw new Error(error.detail);
    }
  }

  async remove(id: string) {
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }

    await this.taskRepository.remove(task);
    return { message: `Tarea con ID ${id} eliminada correctamente` };
  }
}
