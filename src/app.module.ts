import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { UsersModule } from './users/users.module';
import { ProgressModule } from './progress/progress.module';
import { ModuleModule } from './module/module.module';
import { LessonModule } from './lesson/lesson.module';
import { MediaModule } from './media/media.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './config/envs';
import { LanguageModule } from './language/language.module';
import { DictionaryModule } from './dictionary/dictionary.module';
import { WordModule } from './word/word.module';
import { PhoneticModule } from './phonetic/phonetic.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.db_host,
      port: Number(envs.db_port),
      database: envs.db_name,
      username: envs.db_user,
      password: envs.db_password,
      autoLoadEntities: true,
      synchronize: true,
    }),
    FirebaseModule,
    UsersModule,
    ProgressModule,
    ModuleModule,
    LessonModule,
    MediaModule,
    LanguageModule,
    DictionaryModule,
    WordModule,
    PhoneticModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
