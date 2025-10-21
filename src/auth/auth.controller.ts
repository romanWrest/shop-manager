import { Controller, Post, Body, ValidationPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginAdminDto, LoginShopDto, RefreshTokenDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('admin/login')
  @ApiOperation({
    summary: 'Вход администратора',
    description: 'Аутентификация администратора по email и паролю. Возвращает JWT токен и информацию о пользователе. Токен сохраняется в БД (механизм one-device-one-session).'
  })
  @ApiResponse({
    status: 201,
    description: 'Успешная авторизация',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjYjc5OTRmZS02MmNlLTRhOGQtOWQ5NS0zYjA5NWE1MTBkNDEiLCJlbWFpbCI6InJvb3RAZXhhbXBsZS5jb20iLCJyb2xlIjoiUk9PVCIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoxNjAwNjA0ODAwfQ.signature',
        admin: {
          id: 'cb7994fe-62ce-4a8d-9d95-3b095a510d41',
          name: 'Root Admin',
          email: 'root@example.com',
          role: 'ROOT'
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Неверные учетные данные',
    schema: {
      example: {
        message: 'Invalid email or password',
        error: 'Unauthorized',
        statusCode: 401
      }
    }
  })
  async loginAdmin(@Body(ValidationPipe) loginDto: LoginAdminDto) {
    return this.authService.loginAdmin(loginDto.email, loginDto.password);
  }

  @Post('shop/login')
  @ApiOperation({
    summary: 'Вход магазина',
    description: 'Аутентификация магазина по логину и паролю. Возвращает JWT токен и информацию о магазине. Токен сохраняется в БД.'
  })
  @ApiResponse({
    status: 201,
    description: 'Успешная авторизация',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOTZlN2JhZC1kNGQ4LTQ1NTktYjliNy0wZTE4MGZlZGQzZTMiLCJsb2dpbiI6InRlc3RzaG9wMSIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoxNjAwNjA0ODAwfQ.signature',
        shop: {
          id: 'a96e7bad-d4d8-4559-b9b7-0e180fedd3e3',
          name: 'Test Shop',
          login: 'testshop1',
          address: '123 Test St',
          inn: '1234567890'
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Неверные учетные данные',
    schema: {
      example: {
        message: 'Invalid login or password',
        error: 'Unauthorized',
        statusCode: 401
      }
    }
  })
  async loginShop(@Body(ValidationPipe) loginDto: LoginShopDto) {
    return this.authService.loginShop(loginDto.login, loginDto.password);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Выход из системы',
    description: 'Завершение текущей сессии. Инвалидирует JWT токен (удаляет из БД). Требует авторизацию.'
  })
  @ApiResponse({
    status: 201,
    description: 'Успешный выход из системы',
    schema: {
      example: {
        message: 'Вы успешно вышли из системы'
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Не авторизован',
    schema: {
      example: {
        message: 'Unauthorized',
        statusCode: 401
      }
    }
  })
  async logout(@CurrentUser() user: any) {
    return this.authService.logout(user.id, user.role);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Обновление JWT токена',
    description: 'Обновление истекающего или истекшего JWT токена. Возвращает новый токен с обновленным временем жизни.'
  })
  @ApiResponse({
    status: 201,
    description: 'Токен успешно обновлен',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjYjc5OTRmZS02MmNlLTRhOGQtOWQ5NS0zYjA5NWE1MTBkNDEiLCJlbWFpbCI6InJvb3RAZXhhbXBsZS5jb20iLCJyb2xlIjoiUk9PVCIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoxNjAwNjA0ODAwfQ.new_signature',
        user: {
          id: 'cb7994fe-62ce-4a8d-9d95-3b095a510d41',
          email: 'root@example.com',
          role: 'ROOT'
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Недействительный токен',
    schema: {
      example: {
        message: 'Invalid token',
        error: 'Unauthorized',
        statusCode: 401
      }
    }
  })
  async refresh(@Body(ValidationPipe) refreshDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshDto.token);
  }
}
