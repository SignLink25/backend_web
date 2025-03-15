import { Module } from '@nestjs/common';
import { PhoneticService } from './phonetic.service';
import { PhoneticController } from './phonetic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Phonetic } from './entities/phonetic.entity';

@Module({
  controllers: [PhoneticController],
  providers: [PhoneticService],
  imports: [TypeOrmModule.forFeature([Phonetic])],
})
export class PhoneticModule {}
