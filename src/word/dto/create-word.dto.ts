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
  explanation_language: string;

  @IsString()
  @IsNotEmpty()
  sign_language: string;

  @IsArray()
  @IsOptional()
  syllables: string[];

  @IsString()
  @IsOptional()
  context?: string;

  @IsString()
  @IsNotEmpty()
  ipa: string;

  @IsString()
  @IsNotEmpty()
  exemplo: string;

  @IsUUID('4')
  @IsNotEmpty()
  dictionaryId: string;

  @IsArray()
  @IsOptional()
  @IsUUID('4', { each: true }) // IDs de sinónimos
  synonymIds?: string[];
}
