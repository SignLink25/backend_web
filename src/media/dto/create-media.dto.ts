import { IsString, IsUrl } from 'class-validator';

export class CreateMediaDto {
  @IsString()
  type: string;

  @IsString()
  alt: string;
}
