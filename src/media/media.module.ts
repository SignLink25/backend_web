import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { extname, join } from 'path';
import { diskStorage } from 'multer';
import { envs } from 'src/config/envs';

@Module({
  controllers: [MediaController],
  providers: [MediaService],
  imports: [
    TypeOrmModule.forFeature([Media]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|mp4|mp3)$/)) {
          return cb(new Error('Only media are allowed!'), false);
        }
        cb(null, true);
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: `${envs.prefix}/uploads`,
    }),
  ],
})
export class MediaModule {}
