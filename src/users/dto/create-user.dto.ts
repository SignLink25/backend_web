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
import { number } from 'joi';
import { Roles } from 'src/common/enum/roles.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(30)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @IsString()
  @IsOptional()
  number?: string;

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
