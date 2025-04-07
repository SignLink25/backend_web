import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
  Patch,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RoleProtected } from './decorators/role-protected.decorator';
import { Roles } from 'src/common/enum/roles.enum';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { Auth } from './decorators/auth.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.registerUser(createUserDto);
  }

  @Post('verify/:token')
  async verifyUser(@Param('token') token: string) {
    return this.usersService.verifyUser(token);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.loginUser(loginUserDto);
  }

  @Get()
  @Auth(Roles.USER)
  getUsers(@GetUser() user: User) {
    return {
      user,
    };
  }

  @Patch('update')
  @Auth(Roles.USER)
  updateUser(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(user, updateUserDto);
  }

  @Delete('delete')
  @Auth(Roles.USER)
  deleteUser(@GetUser() user: User) {
    return this.usersService.deleteUser(user);
  }
}
