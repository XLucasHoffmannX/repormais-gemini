import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { loginSchema, LoginUserDto } from './dto/login-user.dto';
import { ZodValidationPipe } from '../../shared/pipes';
import { GetUserLogged } from '../../shared/decorators';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { registerSchema, RegisterUserDto } from './dto/register-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.userService.loginUserService(loginUserDto);
  }

  @Post('/register')
  @UsePipes(new ZodValidationPipe(registerSchema))
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.registerUserService(registerUserDto);
  }

  @UseGuards(AuthMiddleware)
  @Get('/auth')
  getUserLogged(@GetUserLogged() user) {
    return this.userService.getUserLoggedService(user);
  }

  @Post('/impersonate/:userId')
  @UseGuards(AuthMiddleware)
  async impersonateUser(@Param('userId') userId: string) {
    return this.userService.impersonateUserService(userId);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.userService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
