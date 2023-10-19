import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdatePasswordDto } from '../dto/user-dto/update-password.dto';
import { UpdateDto } from '../dto/user-dto/update-user.dto';
import { LoginDto } from '../dto/user-dto/user-login.dto';
import { RegisterDto } from '../dto/user-dto/user-register.dto';
import { UserGuard } from '../guards/user.guard';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('user')
export class UserController {
  constructor(private readonly userServise: UserService) {}

  // Get One user //
  @UseGuards(UserGuard)
  @Get('one')
  getOne(@Request() req) {
    return this.userServise.getOne(req);
  }

  // Get User Posts //
  @UseGuards(UserGuard)
  @Get('get/posts')
  getPosts(@Request() req) {
    return this.userServise.getPosts(req);
  }

  // Register //
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.userServise.register(registerDto);
  }

  // Login //
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.userServise.login(loginDto);
  }

  // Change password //
  @Put('update/password')
  updateUserPassword(@Body() updatePassword: UpdatePasswordDto) {
    return this.userServise.updateUserPassword(updatePassword);
  }

  // Update user //
  @UseGuards(UserGuard)
  @Put('update')
  updateUser(@Body() updateDto: UpdateDto, @Request() req) {
    return this.userServise.updateUser(updateDto, req);
  }

  // Delete User //
  @UseGuards(UserGuard)
  @Delete('delete')
  deleteUserByToken(@Request() req) {
    return this.userServise.deleteUserByIdToken(req);
  }
}
