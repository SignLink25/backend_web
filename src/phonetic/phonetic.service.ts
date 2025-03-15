import { Injectable } from '@nestjs/common';
import { CreatePhoneticDto } from './dto/create-phonetic.dto';
import { UpdatePhoneticDto } from './dto/update-phonetic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Phonetic } from './entities/phonetic.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PhoneticService {
  constructor(
    @InjectRepository(Phonetic)
    private phoneticRepository: Repository<Phonetic>,
  ) {}
  async create(createPhoneticDto: CreatePhoneticDto) {
    try {
      const dictionary = this.phoneticRepository.create(createPhoneticDto);
      return await this.phoneticRepository.save(dictionary);
    } catch (error) {
      throw new Error(error.detail);
    }
  }

  findAll() {
    return `This action returns all phonetic`;
  }

  findOne(id: number) {
    return `This action returns a #${id} phonetic`;
  }

  update(id: number, updatePhoneticDto: UpdatePhoneticDto) {
    return `This action updates a #${id} phonetic`;
  }

  remove(id: number) {
    return `This action removes a #${id} phonetic`;
  }
}
