import { IsString, IsUUID } from 'class-validator';
import { Media } from 'src/media/entities/media.entity';
import { Word } from 'src/word/entities/word.entity';

export class CreatePhoneticDto {
  @IsUUID()
  word: Word;

  @IsString()
  ipa: string;

  @IsString()
  syllables: string;

  @IsUUID()
  media: Media;
}
