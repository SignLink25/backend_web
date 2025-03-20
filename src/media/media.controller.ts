import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { messaging } from 'firebase-admin';
import { url } from 'inspector';
import { envs } from 'src/config/envs';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createMedioDto: CreateMediaDto,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded or invalid file type');
    }

    return this.mediaService.create(
      createMedioDto,
      `${envs.server_url}${envs.prefix}/uploads/${file.filename}`,
    );
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.mediaService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.mediaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
    return this.mediaService.update(+id, updateMediaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(+id);
  }
}
