import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
  IsUUID,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Roles } from 'src/common/enum/roles.enum';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(30)
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  selfDescription?: string;

  @IsString()
  @IsOptional()
  whyLearn?: string;

  @IsString()
  @IsOptional()
  level?: string;

  @IsUUID('4')
  @IsOptional()
  mediaId?: string;
}
