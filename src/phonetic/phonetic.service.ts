import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePhoneticDto } from './dto/create-phonetic.dto';
import { UpdatePhoneticDto } from './dto/update-phonetic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Phonetic } from './entities/phonetic.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class PhoneticService {
  constructor(
    @InjectRepository(Phonetic)
    private phoneticRepository: Repository<Phonetic>,
  ) {}

  async create(createPhoneticDto: CreatePhoneticDto) {
    try {
      const phonetic = this.phoneticRepository.create(createPhoneticDto);
      return await this.phoneticRepository.save(phonetic);
    } catch (error) {
      throw new Error(error.detail);
    }
  }

  async findAll({ limit = 10, offset = 0 }: PaginationDto) {
    const [data, totalResults] = await this.phoneticRepository.findAndCount({
      take: limit,
      skip: offset * limit,
      relations: ['word'], // Suponiendo que los fonéticos están relacionados con una palabra
    });

    if (!data.length || totalResults === 0) {
      throw new NotFoundException(`No se encontraron registros fonéticos.`);
    }

    return { limit, offset, partialResults: data.length, totalResults, data };
  }

  async findOne(id: string) {
    let phonetic: Phonetic;
    if (isUUID(id)) {
      phonetic = await this.phoneticRepository.findOne({
        where: { id },
        relations: ['word'], // Ajusta la relación si es necesario
      });
    }

    if (!phonetic) {
      throw new NotFoundException(
        `No se encontró ningún registro fonético con el ID: ${id}`,
      );
    }

    return phonetic;
  }

  async update(id: string, updatePhoneticDto: UpdatePhoneticDto) {
    try {
      const phonetic = await this.phoneticRepository.findOneBy({ id });

      if (!phonetic) {
        throw new NotFoundException(
          `Registro fonético con ID ${id} no encontrado`,
        );
      }

      if (Object.keys(updatePhoneticDto).length === 0) {
        return phonetic;
      }

      await this.phoneticRepository.update(id, updatePhoneticDto);
      return this.phoneticRepository.findOne({
        where: { id },
        relations: ['word'],
      });
    } catch (error) {
      throw new Error(error.detail);
    }
  }

  async remove(id: string) {
    const phonetic = await this.phoneticRepository.findOneBy({ id });

    if (!phonetic) {
      throw new NotFoundException(
        `Registro fonético con ID ${id} no encontrado`,
      );
    }

    await this.phoneticRepository.remove(phonetic);
    return {
      message: `Registro fonético con ID ${id} eliminado correctamente`,
    };
  }
}
