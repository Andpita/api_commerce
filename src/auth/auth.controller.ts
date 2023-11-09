import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginDTO } from './dtos/login.dto';
import { AuthService } from './auth.service';
import { ReturnLoginDTO } from './dtos/returnLogin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post()
  async login(@Body() loginData: LoginDTO): Promise<ReturnLoginDTO> {
    return this.authService.login(loginData);
  }
}
