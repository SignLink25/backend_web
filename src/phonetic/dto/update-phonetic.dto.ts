import { PartialType } from '@nestjs/mapped-types';
import { CreatePhoneticDto } from './create-phonetic.dto';

export class UpdatePhoneticDto extends PartialType(CreatePhoneticDto) {}
