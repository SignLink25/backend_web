import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word } from './entities/word.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class WordService {
  constructor(
    @InjectRepository(Word)
    private wordRepository: Repository<Word>,
  ) {}

  async create(createWordDto: CreateWordDto) {
    try {
      const word = this.wordRepository.create(createWordDto);
      return await this.wordRepository.save(word);
    } catch (error) {
      throw new Error(error.detail);
    }
  }

  async findAll({ limit = 10, offset = 0 }: PaginationDto) {
    const [data, totalResults] = await this.wordRepository.findAndCount({
      take: limit,
      skip: offset * limit,
      relations: ['phonetic', 'media', 'dictionary', 'synonyms'], // Relaciones completas
    });

    if (!data.length || totalResults === 0) {
      throw new NotFoundException(`No se encontraron palabras.`);
    }

    return { limit, offset, partialResults: data.length, totalResults, data };
  }

  async findOne(id: string) {
    let word: Word;
    if (isUUID(id)) {
      word = await this.wordRepository.findOne({
        where: { id },
        relations: ['phonetic', 'media', 'dictionary', 'synonyms'], // Relaciones completas
      });
    }

    if (!word) {
      throw new NotFoundException(
        `No se encontró ninguna palabra con el ID: ${id}`,
      );
    }

    return word;
  }

  async update(id: string, updateWordDto: UpdateWordDto) {
    try {
      const word = await this.wordRepository.findOneBy({ id });

      if (!word) {
        throw new NotFoundException(`Palabra con ID ${id} no encontrada`);
      }

      if (Object.keys(updateWordDto).length === 0) {
        return word;
      }

      await this.wordRepository.update(id, updateWordDto);
      return this.wordRepository.findOne({
        where: { id },
        relations: ['phonetic', 'media', 'dictionary', 'synonyms'],
      });
    } catch (error) {
      throw new Error(error.detail);
    }
  }

  async remove(id: string) {
    const word = await this.wordRepository.findOneBy({ id });

    if (!word) {
      throw new NotFoundException(`Palabra con ID ${id} no encontrada`);
    }

    await this.wordRepository.remove(word);
    return { message: `Palabra con ID ${id} eliminada correctamente` };
  }
}
