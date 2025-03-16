import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
  ) {}

  async create(createLessonDto: CreateLessonDto) {
    try {
      const lesson = this.lessonRepository.create(createLessonDto);
      return await this.lessonRepository.save(lesson);
    } catch (error) {
      throw new Error(error.detail);
    }
  }

  async findAll({ limit = 10, offset = 0 }: PaginationDto) {
    const [data, totalResults] = await this.lessonRepository.findAndCount({
      take: limit,
      skip: offset * limit,
      relations: ['course'], // Suponiendo que las lecciones están relacionadas con un curso
    });

    if (!data.length || totalResults == 0) {
      throw new NotFoundException(`No se encontraron lecciones.`);
    }

    return { limit, offset, partialResults: data.length, totalResults, data };
  }

  async findOne(id: string) {
    let lesson: Lesson;
    if (isUUID(id)) {
      lesson = await this.lessonRepository.findOne({
        where: { id },
        relations: ['course'], // Suponiendo que hay una relación con Course
      });
    }

    if (!lesson) {
      throw new NotFoundException(
        `No se encontró ninguna lección con el ID: ${id}`,
      );
    }

    return lesson;
  }

  async update(id: string, updateLessonDto: UpdateLessonDto) {
    try {
      const lesson = await this.lessonRepository.findOneBy({ id });

      if (!lesson) {
        throw new NotFoundException(`Lección con ID ${id} no encontrada`);
      }

      if (Object.keys(updateLessonDto).length === 0) {
        return lesson;
      }

      await this.lessonRepository.update(id, updateLessonDto);
      return this.lessonRepository.findOne({
        where: { id },
        relations: ['course'],
      });
    } catch (error) {
      throw new Error(error.detail);
    }
  }

  async remove(id: string) {
    const lesson = await this.lessonRepository.findOneBy({ id });

    if (!lesson) {
      throw new NotFoundException(`Lección con ID ${id} no encontrada`);
    }

    await this.lessonRepository.remove(lesson);
    return { message: `Lección con ID ${id} eliminada correctamente` };
  }
}
