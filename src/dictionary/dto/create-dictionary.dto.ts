import { IsString, IsUUID } from 'class-validator';
import { Language } from 'src/language/entities/language.entity';

export class CreateDictionaryDto {
  @IsString()
  title: string;

  @IsUUID()
  language: Language;
}
