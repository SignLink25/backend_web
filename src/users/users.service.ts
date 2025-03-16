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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    const { email, password, username, level } = createUserDto;

    try {
      // Crear usuario en Firebase Authentication
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: username,
      });

      const newUser = this.userRepository.create({
        id: userRecord.uid, // Ahora usamos el UID de Firebase como ID
        username,
        email,
        password: bcrypt.hashSync(password, 10), // No almacenamos la contraseña
        level,
      });

      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async loginUser(idToken: string) {
    try {
      // Verificar el token de Firebase
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const user = await this.userRepository.findOne({
        where: { id: decodedToken.uid }, // Ahora buscamos por el UID de Firebase
      });

      if (!user) {
        throw new NotFoundException(
          'Usuario no encontrado en la base de datos',
        );
      }

      return { message: 'Inicio de sesión exitoso', user };
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
}
