import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { isUUID } from 'class-validator';
import { ModuleClass } from './entities/module.entity';

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(ModuleClass)
    private moduleRepository: Repository<ModuleClass>,
  ) {}

  async create(createModuleDto: CreateModuleDto) {
    try {
      const module = this.moduleRepository.create(createModuleDto);
      return await this.moduleRepository.save(module);
    } catch (error) {
      throw new Error(error.detail);
    }
  }

  async findAll({ limit = 10, offset = 0 }: PaginationDto) {
    const [data, totalResults] = await this.moduleRepository.findAndCount({
      take: limit,
      skip: offset * limit,
      relations: ['course'], // Suponiendo que los módulos están relacionados con un curso
    });

    if (!data.length || totalResults === 0) {
      throw new NotFoundException(`No se encontraron módulos.`);
    }

    return { limit, offset, partialResults: data.length, totalResults, data };
  }

  async findOne(id: string) {
    let module: ModuleClass;
    if (isUUID(id)) {
      module = await this.moduleRepository.findOne({
        where: { id },
        relations: ['course'], // Ajusta la relación si es necesario
      });
    }

    if (!module) {
      throw new NotFoundException(
        `No se encontró ningún módulo con el ID: ${id}`,
      );
    }

    return module;
  }

  async update(id: string, updateModuleDto: UpdateModuleDto) {
    try {
      const module = await this.moduleRepository.findOneBy({ id });

      if (!module) {
        throw new NotFoundException(`Módulo con ID ${id} no encontrado`);
      }

      if (Object.keys(updateModuleDto).length === 0) {
        return module;
      }

      await this.moduleRepository.update(id, updateModuleDto);
      return this.moduleRepository.findOne({
        where: { id },
        relations: ['course'],
      });
    } catch (error) {
      throw new Error(error.detail);
    }
  }

  async remove(id: string) {
    const module = await this.moduleRepository.findOneBy({ id });

    if (!module) {
      throw new NotFoundException(`Módulo con ID ${id} no encontrado`);
    }

    await this.moduleRepository.remove(module);
    return { message: `Módulo con ID ${id} eliminado correctamente` };
  }
}
