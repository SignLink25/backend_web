import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWordDto {
  @IsString()
  @IsNotEmpty()
  word: string;

  @IsString()
  @IsNotEmpty()
  meaning: string;

  @IsString()
  @IsNotEmpty()
  grammaticalClass: string;

  @IsArray()
  @IsOptional()
  @IsUUID('4', { each: true }) // IDs de phonetic
  phoneticIds?: string[];

  @IsArray()
  @IsOptional()
  @IsUUID('4', { each: true }) // IDs de media
  mediaIds?: string[];

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsOptional()
  context?: string;

  @IsUUID('4')
  @IsNotEmpty()
  dictionaryId: string;

  @IsArray()
  @IsOptional()
  @IsUUID('4', { each: true }) // IDs de sinónimos
  synonymIds?: string[];
}
