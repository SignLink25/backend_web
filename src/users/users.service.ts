import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as admin from 'firebase-admin';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    const { email, password, username, ...userData } = createUserDto;

    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: username,
      });

      console.log(userRecord);

      const newUser = this.userRepository.create({
        id: userRecord.uid,
        username,
        email,
        password: bcrypt.hashSync(password, 10),
        ...userData,
      });

      await this.userRepository.save(newUser);

      delete newUser.password;

      return { ...newUser, token: this.getJwtToken({ id: newUser.id }) };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    try {
      const { password, email } = loginUserDto;

      const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true, id: true },
      });

      if (!user) {
        throw new NotFoundException('Error at login');
      }

      if (!bcrypt.compareSync(password, user.password)) {
        throw new UnauthorizedException('Error at login');
      }

      await admin.auth().setCustomUserClaims(user.id, {
        lastLogin: new Date().toISOString(),
      });

      return { ...user, token: this.getJwtToken({ id: user.id }) };
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  async findOne(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    return user;
  }
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
