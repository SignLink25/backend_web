import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Progress } from './entities/progress.entity';

@Module({
  controllers: [ProgressController],
  providers: [ProgressService],
  imports: [TypeOrmModule.forFeature([Progress])],
})
export class ProgressModule {}
