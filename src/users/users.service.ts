import {
  BadRequestException,
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
import { UpdateUserDto } from './dto/update-user.dto';
import { MailService } from 'src/mail/mail.service';
import { ResetPassword } from './entities/reset-password.entity';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { v4 as uuidv4 } from 'uuid';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ResetPassword)
    private resetPasswordRepository: Repository<ResetPassword>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    const { email, password, username, ...userData } = createUserDto;

    try {
      const userExists = await this.userRepository.findOne({
        where: { email },
      });

      if (userExists && userExists.isVerified === true) {
        throw new UnauthorizedException('Usuario ya existe');
      }

      const verificationCode = Math.floor(
        1000 + Math.random() * 9000,
      ).toString();
      const verificationExpires = new Date(Date.now() + 5 * 60 * 1000);

      let newUser;

      if (userExists && userExists.isVerified === false) {
        await this.userRepository.update(userExists.id, {
          token: verificationCode,
          expirationToken: verificationExpires.toISOString(),
          ...userData,
        });
        newUser = await this.userRepository.findOne({
          where: { id: userExists.id },
        });
      } else {
        newUser = this.userRepository.create({
          username,
          email,
          password: bcrypt.hashSync(password, 10),
          isVerified: false,
          token: verificationCode,
          expirationToken: verificationExpires.toISOString(),
          ...userData,
        });
        await this.userRepository.save(newUser);
      }

      await this.mailService.sendUserConfirmation(newUser);

      delete newUser.password;

      delete newUser.token;
      delete newUser.expirationToken;

      return { ...newUser };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async verifyUser(token: string) {
    const user = await this.userRepository.findOne({
      where: { token },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (new Date(user.expirationToken) < new Date()) {
      throw new UnauthorizedException('Token expirado');
    }

    user.isVerified = true;
    user.token = null;
    user.expirationToken = null;

    await this.userRepository.save(user);

    return { ...user, jwtoken: this.getJwtToken({ id: user.id }) };
  }

  async loginUser(loginUserDto: LoginUserDto) {
    try {
      const { password, email } = loginUserDto;

      const user = await this.userRepository.findOne({
        where: { email },
        select: {
          email: true,
          password: true,
          id: true,
          isVerified: true,
        },
      });

      if (!user || !user.isVerified) {
        throw new NotFoundException('Error at login');
      }

      if (!bcrypt.compareSync(password, user.password)) {
        throw new UnauthorizedException('Error at login');
      }

      await this.userRepository.update(user.id, { isActive: true });

      return { ...user, token: this.getJwtToken({ id: user.id }) };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOne(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    return user;
  }

  async sendMailReset(resetPasswordDto: ResetPasswordDto) {
    const token = uuidv4();
    try {
      let showUser = await this.userRepository.findOne({
        where: { email: resetPasswordDto.email },
      });
      if (!showUser) {
        return {
          message: 'Usuario no encontrado',
        };
      }

      let user = await this.resetPasswordRepository.findOne({
        where: { email: resetPasswordDto.email },
      });

      if (!user) {
        const userCreate = this.resetPasswordRepository.create({
          email: resetPasswordDto.email,
          token: token,
          dateValid: new Date(Date.now() + 15 * 60 * 1000),
        });
        await this.resetPasswordRepository.save(userCreate);
        await this.mailService.sendResetPassword(userCreate);
        return ['Mail sended'];
      } else {
        user.token = token;
        user.dateValid = new Date(Date.now() + 15 * 60 * 1000);
        await this.resetPasswordRepository.save(user);
        await this.mailService.sendResetPassword(user);
        return ['Mail sended'];
      }
    } catch (error) {
      throw new BadRequestException('Error al enviar el correo electrónico');
    }
  }

  async getResetPassword(token: string) {
    try {
      const user = await this.resetPasswordRepository.findOne({
        where: { token },
      });

      if (!user || (user.dateValid && new Date(user.dateValid) < new Date())) {
        throw new BadRequestException('Usuario no encontrado');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<User> {
    try {
      const passUser = await this.resetPasswordRepository.findOne({
        where: { token: changePasswordDto.token },
      });

      if (
        !passUser ||
        (passUser.dateValid && new Date(passUser.dateValid) < new Date())
      ) {
        throw new BadRequestException('Usuario no encontrado');
      }

      await this.resetPasswordRepository.delete(passUser);

      // Buscar al usuario por su ID
      const user = await this.userRepository.findOne({
        where: { email: passUser.email },
      });

      const password = bcrypt.hashSync(changePasswordDto.newPassword, 10);

      user.password = password;

      await this.userRepository.save(user);

      delete user.password;

      return user;
    } catch (error) {
      throw new BadRequestException('Error al cambiar la contraseña');
    }
  }

  async updateUser(user: User, updateUserDto: UpdateUserDto) {
    const { id } = user;

    await this.userRepository.update(id, updateUserDto);

    return await this.findOne(id);
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);

    return token;
  }

  async deleteUser(user: User) {
    try {
      if (!user || !user.isVerified) {
        throw new NotFoundException('Usuario no encontrado');
      }

      await this.mailService.sendUserDelete(user);

      await this.userRepository.update(user.id, {
        isActive: false,
        deletionDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      });

      return {
        message:
          'Usuario marcado para eliminación. Se eliminará permanentemente en 30 días si no vuelve a iniciar sesión.',
        user,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
