import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { UpdateDictionaryDto } from './dto/update-dictionary.dto';
import { Dictionary } from './entities/dictionary.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectRepository(Dictionary)
    private dictionaryRepository: Repository<Dictionary>,
  ) {}
  async create(createDictionaryDto: CreateDictionaryDto) {
    try {
      const dictionary = this.dictionaryRepository.create(createDictionaryDto);
      return await this.dictionaryRepository.save(dictionary);
    } catch (error) {
      throw new Error(error.detail);
    }
  }

  async findAll({ limit = 10, offset = 0 }: PaginationDto) {
    const [data, totalResults] = await this.dictionaryRepository.findAndCount({
      take: limit,
      skip: offset * limit,
      relations: ['language'],
    });
    if (!data.length || totalResults == 0)
      throw new NotFoundException(`There aren't results for the search`);
    return { limit, offset, partialResults: data.length, totalResults, data };
  }

  async findOne(id: string) {
    let dictionary: Dictionary;
    if (isUUID(id)) {
      dictionary = await this.dictionaryRepository.findOne({
        where: { id },
        relations: ['language'],
      });
    }

    if (!dictionary) {
      throw new NotFoundException(
        `There are no results for the search. Search term: ${id}`,
      );
    }

    return dictionary;
  }

  async update(id: string, updateDictionaryDto: UpdateDictionaryDto) {
    try {
      const language = await this.dictionaryRepository.findOneBy({ id: id });
      if (!language) {
        throw new NotFoundException(`Language with ID ${id} not found`);
      }
      if (Object.keys(this.dictionaryRepository).length === 0) {
        return language;
      }

      await this.dictionaryRepository.update(id, updateDictionaryDto);
      return this.dictionaryRepository.findOne({
        where: { id },
        relations: ['language'],
      });
    } catch (e) {
      throw new Error(e.detail);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} dictionary`;
  }
}
