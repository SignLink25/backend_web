import { Module } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { DictionaryController } from './dictionary.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dictionary } from './entities/dictionary.entity';

@Module({
  controllers: [DictionaryController],
  providers: [DictionaryService],
  imports: [TypeOrmModule.forFeature([Dictionary])],
})
export class DictionaryModule {}
