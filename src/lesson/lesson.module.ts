import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';

@Module({
  controllers: [LessonController],
  providers: [LessonService],
  imports: [TypeOrmModule.forFeature([Lesson])],
})
export class LessonModule {}
