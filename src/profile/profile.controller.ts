import { Controller, Patch, Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Профиль')
@ApiBearerAuth('JWT-auth')
@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Patch('password')
  @ApiOperation({
    summary: 'Смена пароля текущего пользователя',
    description: 'Изменение пароля для текущего авторизованного пользователя (администратора или магазина). Требует подтверждение текущего пароля. Для администраторов: токен автоматически инвалидируется (удаляется из БД) для безопасности. Для магазинов: пароль обновляется в БД. После смены пароля требуется повторный вход.'
  })
  @ApiResponse({
    status: 200,
    description: 'Пароль успешно изменен',
    schema: {
      example: {
        message: 'Пароль успешно изменен. Пожалуйста, войдите заново.'
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Неверный текущий пароль или пользователь не авторизован',
    schema: {
      example: {
        message: 'Неверный текущий пароль',
        error: 'Unauthorized',
        statusCode: 401
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Пользователь не найден',
    schema: {
      example: {
        message: 'Администратор не найден',
        error: 'Not Found',
        statusCode: 404
      }
    }
  })
  async changePassword(
    @CurrentUser() user: any,
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
  ) {
    return this.profileService.changePassword(user.id, user.role, changePasswordDto);
  }
}
