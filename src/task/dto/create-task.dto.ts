import { IsArray, IsString, IsUUID } from 'class-validator';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { Media } from 'src/media/entities/media.entity';

export class CreateTaskDto {
  question: string;

  @IsString()
  correctAnswer: string;

  @IsString()
  questionType: string;

  @IsArray()
  options: string[];

  @IsUUID()
  lesson: Lesson;

  @IsUUID()
  media: Media;
}
