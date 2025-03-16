import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progress } from './entities/progress.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private progressRepository: Repository<Progress>,
  ) {}

  async create(createProgressDto: CreateProgressDto) {
    try {
      const progress = this.progressRepository.create(createProgressDto);
      return await this.progressRepository.save(progress);
    } catch (error) {
      throw new Error(error.detail);
    }
  }

  async findAll({ limit = 10, offset = 0 }: PaginationDto) {
    const [data, totalResults] = await this.progressRepository.findAndCount({
      take: limit,
      skip: offset * limit,
      relations: ['user', 'lesson'], // Suponiendo que el progreso está relacionado con un usuario y una lección
    });

    if (!data.length || totalResults === 0) {
      throw new NotFoundException(`No se encontraron registros de progreso.`);
    }

    return { limit, offset, partialResults: data.length, totalResults, data };
  }

  async findOne(id: string) {
    let progress: Progress;
    if (isUUID(id)) {
      progress = await this.progressRepository.findOne({
        where: { id },
        relations: ['user', 'lesson'], // Ajusta la relación si es necesario
      });
    }

    if (!progress) {
      throw new NotFoundException(
        `No se encontró ningún registro de progreso con el ID: ${id}`,
      );
    }

    return progress;
  }

  async update(id: string, updateProgressDto: UpdateProgressDto) {
    try {
      const progress = await this.progressRepository.findOneBy({ id });

      if (!progress) {
        throw new NotFoundException(
          `Registro de progreso con ID ${id} no encontrado`,
        );
      }

      if (Object.keys(updateProgressDto).length === 0) {
        return progress;
      }

      await this.progressRepository.update(id, updateProgressDto);
      return this.progressRepository.findOne({
        where: { id },
        relations: ['user', 'lesson'],
      });
    } catch (error) {
      throw new Error(error.detail);
    }
  }

  async remove(id: string) {
    const progress = await this.progressRepository.findOneBy({ id });

    if (!progress) {
      throw new NotFoundException(
        `Registro de progreso con ID ${id} no encontrado`,
      );
    }

    await this.progressRepository.remove(progress);
    return {
      message: `Registro de progreso con ID ${id} eliminado correctamente`,
    };
  }
}
