import { IsString, IsUUID } from 'class-validator';
import { Media } from 'src/media/entities/media.entity';

export class CreatePhoneticDto {
  @IsString()
  word: string;

  @IsString()
  ipa: string;

  @IsString()
  phonetic_spelling: string;

  @IsUUID()
  media: Media;
}
