import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from './entities/language.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { isUUID } from 'class-validator';
import { UpdateProgressDto } from 'src/progress/dto/update-progress.dto';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
  ) {}
  async create(createLanguageDto: CreateLanguageDto) {
    try {
      const language = this.languageRepository.create(createLanguageDto);
      return await this.languageRepository.save(language);
    } catch (error) {
      throw new Error(error.detail);
    }
  }

  async findAll({ limit = 10, offset = 0 }: PaginationDto) {
    const [data, totalResults] = await this.languageRepository.findAndCount({
      take: limit,
      skip: offset * limit,
    });
    if (!data.length || totalResults == 0)
      throw new NotFoundException(`There aren't results for the search`);
    return { limit, offset, partialResults: data.length, totalResults, data };
  }

  async findOne(id: string) {
    let language: Language;
    if (isUUID(id)) {
      language = await this.languageRepository.findOneBy({ id: id });
    }

    if (!language) {
      throw new NotFoundException(
        `There are no results for the search. Search term: ${id}`,
      );
    }

    return language;
  }

  async update(id: string, updateLanguageDto: UpdateLanguageDto) {
    const language = await this.languageRepository.findOneBy({ id: id });
    if (!language) {
      throw new NotFoundException(`Language with ID ${id} not found`);
    }
    if (Object.keys(updateLanguageDto).length === 0) {
      return language;
    }

    await this.languageRepository.update(id, updateLanguageDto);
    return this.languageRepository.findOneBy({ id: id });
  }

  remove(id: number) {
    return `This action removes a #${id} language`;
  }
}
