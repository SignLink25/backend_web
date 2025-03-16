import { Module } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleClass } from './entities/module.entity';

@Module({
  controllers: [ModuleController],
  providers: [ModuleService],
  imports: [TypeOrmModule.forFeature([ModuleClass])],
})
export class ModuleModule {}
