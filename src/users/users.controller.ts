import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.registerUser(createUserDto);
  }

  @Post('login')
  async login(@Body('idToken') idToken: string) {
    if (!idToken) {
      throw new UnauthorizedException('Token de autenticación requerido');
    }
    return this.usersService.loginUser(idToken);
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
