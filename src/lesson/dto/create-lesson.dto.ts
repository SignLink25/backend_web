import { IsString, IsUUID } from 'class-validator';
import { ModuleClass } from 'src/module/entities/module.entity';

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsString()
  unity: string;

  @IsString()
  icon: string;

  @IsUUID()
  module: ModuleClass;
}
