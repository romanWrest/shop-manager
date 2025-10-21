import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminsService } from './admins.service';
import { CreateAdminDto, UpdatePasswordDto } from './dto/admin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Администраторы')
@ApiBearerAuth('JWT-auth')
@Controller('admins')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminsController {
  constructor(private adminsService: AdminsService) {}

  @Get()
  @Roles('ROOT', 'MANAGER')
  @ApiOperation({ summary: 'Получить список администраторов' })
  @ApiResponse({ status: 200, description: 'Список администраторов' })
  async findAll() {
    return this.adminsService.findAll();
  }

  @Post()
  @Roles('ROOT')
  @ApiOperation({
    summary: 'Создать нового администратора',
    description: 'Создание нового администратора только с ролью MANAGER. Доступно только ROOT.'
  })
  @ApiResponse({
    status: 201,
    description: 'Администратор успешно создан',
    schema: {
      example: {
        id: 'cb7994fe-62ce-4a8d-9d95-3b095a510d41',
        name: 'Имя Фамилия',
        email: 'manager@example.com',
        role: 'MANAGER',
        createdAt: '2025-01-17T10:00:00.000Z',
        updatedAt: '2025-01-17T10:00:00.000Z'
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные или email уже используется',
    schema: {
      example: {
        message: 'Email already exists',
        error: 'Bad Request',
        statusCode: 400
      }
    }
  })
  async create(@Body(ValidationPipe) createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  @Patch(':id/password')
  @Roles('ROOT')
  @ApiOperation({ summary: 'Изменить пароль администратора (только ROOT)' })
  @ApiResponse({ status: 200, description: 'Пароль изменен' })
  async updatePassword(
    @Param('id') id: string,
    @Body(ValidationPipe) updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.adminsService.updatePassword(id, updatePasswordDto);
  }

  @Delete(':id')
  @Roles('ROOT')
  @ApiOperation({ summary: 'Удалить администратора (только ROOT)' })
  @ApiResponse({ status: 200, description: 'Администратор удален' })
  async delete(@Param('id') id: string) {
    return this.adminsService.delete(id);
  }
}
