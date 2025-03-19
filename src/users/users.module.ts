import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FirebaseModule } from '../firebase/firebase.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config/envs';
import { JwtStrategy } from './strategies/jwt.strategies';
import { MailModule } from 'src/mail/mail.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  imports: [
    TypeOrmModule.forFeature([User]),
    FirebaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        secret: envs.jwt_secret,
        signOptions: { expiresIn: '1y' },
      }),
    }),
    MailModule,
  ],
  exports: [UsersService, JwtStrategy, PassportModule, JwtModule],
})
export class UsersModule {}
