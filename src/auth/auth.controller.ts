import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user-decorator';
import { User } from './entities/auth.entity';
import { RawHeaders } from './decorators/get-raw-headers.decorator';
import { UserRoleGuard } from './guards/use-role/use-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Get('private3')
  @Auth(ValidRoles.admin)
  privateRoute3() {
    return {
      ok: true,
    };
  }
}
