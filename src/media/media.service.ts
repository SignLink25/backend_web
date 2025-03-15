import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
  ) {}
  async create(createMediaDto: CreateMediaDto, url: string) {
    try {
      const media = this.mediaRepository.create({
        ...createMediaDto,
        url,
      });
      return await this.mediaRepository.save(media);
    } catch (error) {
      throw new BadRequestException(error.detail);
    }
  }

  async findAll({ limit = 10, offset = 0 }: PaginationDto) {
    const [data, totalResults] = await this.mediaRepository.findAndCount({
      take: limit,
      skip: offset * limit,
    });
    if (!data.length || totalResults == 0)
      throw new NotFoundException(`There aren't results for the search`);
    return { limit, offset, partialResults: data.length, totalResults, data };
  }

  async findOne(id: string) {
    let media: Media;
    if (isUUID(id)) {
      media = await this.mediaRepository.findOneBy({ id: id });
    }

    if (!media) {
      throw new NotFoundException(
        `There are no results for the search. Search term: ${id}`,
      );
    }

    return media;
  }

  update(id: number, updateMediaDto: UpdateMediaDto) {
    return `This action updates a #${id} media`;
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }
}
