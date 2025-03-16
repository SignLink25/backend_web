import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { Roles } from 'src/common/enum/roles.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string; // Se recomienda encriptarla antes de guardarla en la base de datos

  @IsEnum(Roles)
  @IsOptional()
  role?: Roles; // Si no se envía, se usará el valor por defecto en la entidad

  @IsString()
  @IsOptional()
  selfDescription?: string;

  @IsString()
  @IsOptional()
  whyLearn?: string;

  @IsString()
  @IsNotEmpty()
  level: string;

  @IsUUID('4')
  @IsOptional()
  mediaId?: string; // Relación con Media (opcional)
}
