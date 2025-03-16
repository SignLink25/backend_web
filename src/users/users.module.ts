import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User]),
    FirebaseModule, // Importamos el módulo de Firebase
  ],
  exports: [UsersService],
})
export class UsersModule {}
