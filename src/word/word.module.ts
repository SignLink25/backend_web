import { Module } from '@nestjs/common';
import { WordService } from './word.service';
import { WordController } from './word.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './entities/word.entity';

@Module({
  controllers: [WordController],
  providers: [WordService],
  imports: [TypeOrmModule.forFeature([Word])],
})
export class WordModule {}
