import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PhoneticService } from './phonetic.service';
import { CreatePhoneticDto } from './dto/create-phonetic.dto';
import { UpdatePhoneticDto } from './dto/update-phonetic.dto';

@Controller('phonetic')
export class PhoneticController {
  constructor(private readonly phoneticService: PhoneticService) {}

  @Post()
  create(@Body() createPhoneticDto: CreatePhoneticDto) {
    return this.phoneticService.create(createPhoneticDto);
  }

  @Get()
  findAll() {
    return this.phoneticService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.phoneticService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePhoneticDto: UpdatePhoneticDto) {
    return this.phoneticService.update(+id, updatePhoneticDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.phoneticService.remove(+id);
  }
}
