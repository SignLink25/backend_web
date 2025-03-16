import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PhoneticService } from './phonetic.service';
import { CreatePhoneticDto } from './dto/create-phonetic.dto';
import { UpdatePhoneticDto } from './dto/update-phonetic.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('phonetic')
export class PhoneticController {
  constructor(private readonly phoneticService: PhoneticService) {}

  @Post()
  create(@Body() createPhoneticDto: CreatePhoneticDto) {
    return this.phoneticService.create(createPhoneticDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.phoneticService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.phoneticService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePhoneticDto: UpdatePhoneticDto,
  ) {
    return this.phoneticService.update(id, updatePhoneticDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.phoneticService.remove(id);
  }
}
