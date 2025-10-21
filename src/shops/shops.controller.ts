import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ShopsService } from './shops.service';
import { CreateShopDto, UpdateShopCredentialsDto } from './dto/shop.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('shops')
@ApiTags("Магазины")
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ROOT', 'MANAGER')
export class ShopsController {
  constructor(private shopsService: ShopsService) {}

  @Get()
  @ApiOperation({
    summary: 'Получить список всех магазинов',
    description: 'Возвращает список всех магазинов с информацией о владельцах и привязанных терминалах. Требует роль ROOT или MANAGER.'
  })
  @ApiResponse({
    status: 200,
    description: 'Список магазинов успешно получен',
    schema: {
      example: [
        {
          id: 'a96e7bad-d4d8-4559-b9b7-0e180fedd3e3',
          name: 'Магазин "Продукты 24"',
          address: 'г. Москва, ул. Ленина, д. 10',
          inn: '7707083893',
          kpp: '770701001',
          ogrn: '1027700132195',
          login: 'shop_products24',
          ownerId: 'f5b9e8a1-3c4d-4e5f-9a8b-7c6d5e4f3a2b',
          createdAt: '2025-10-20T10:00:00.000Z',
          updatedAt: '2025-10-20T10:00:00.000Z',
          owner: {
            id: 'f5b9e8a1-3c4d-4e5f-9a8b-7c6d5e4f3a2b',
            name: 'Иванов Иван Иванович',
            phone: '+79991234567'
          },
          terminals: [
            {
              id: '0bd492c9-5d78-428d-8ef3-3d5ece1296c6',
              macAddress: 'FF:EE:DD:CC:BB:AA',
              status: 'ACTIVE'
            }
          ]
        }
      ]
    }
  })
  async findAll() {
    return this.shopsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Получить информацию о магазине по ID',
    description: 'Возвращает детальную информацию о конкретном магазине, включая данные владельца и список терминалов.'
  })
  @ApiResponse({
    status: 200,
    description: 'Информация о магазине успешно получена',
    schema: {
      example: {
        id: 'a96e7bad-d4d8-4559-b9b7-0e180fedd3e3',
        name: 'Магазин "Продукты 24"',
        address: 'г. Москва, ул. Ленина, д. 10',
        inn: '7707083893',
        kpp: '770701001',
        ogrn: '1027700132195',
        login: 'shop_products24',
        ownerId: 'f5b9e8a1-3c4d-4e5f-9a8b-7c6d5e4f3a2b',
        createdAt: '2025-10-20T10:00:00.000Z',
        updatedAt: '2025-10-20T10:00:00.000Z',
        owner: {
          id: 'f5b9e8a1-3c4d-4e5f-9a8b-7c6d5e4f3a2b',
          name: 'Иванов Иван Иванович',
          phone: '+79991234567',
          email: 'ivanov@example.com'
        },
        terminals: []
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Магазин не найден',
    schema: {
      example: {
        message: 'Shop not found',
        error: 'Not Found',
        statusCode: 404
      }
    }
  })
  async findOne(@Param('id') id: string) {
    return this.shopsService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Создать новый магазин',
    description: 'Создание нового магазина с учетными данными для входа. Пароль автоматически хешируется. Логин должен быть уникальным в системе.'
  })
  @ApiResponse({
    status: 201,
    description: 'Магазин успешно создан',
    schema: {
      example: {
        id: 'a96e7bad-d4d8-4559-b9b7-0e180fedd3e3',
        name: 'Магазин "Продукты 24"',
        address: 'г. Москва, ул. Ленина, д. 10',
        inn: '7707083893',
        kpp: '770701001',
        ogrn: '1027700132195',
        login: 'shop_products24',
        ownerId: 'f5b9e8a1-3c4d-4e5f-9a8b-7c6d5e4f3a2b',
        createdAt: '2025-10-20T10:00:00.000Z',
        updatedAt: '2025-10-20T10:00:00.000Z',
        owner: {
          id: 'f5b9e8a1-3c4d-4e5f-9a8b-7c6d5e4f3a2b',
          name: 'Иванов Иван Иванович',
          phone: '+79991234567'
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные или логин уже используется',
    schema: {
      example: {
        message: 'Shop with this login already exists',
        error: 'Bad Request',
        statusCode: 400
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Владелец магазина не найден',
    schema: {
      example: {
        message: 'Shop owner not found',
        error: 'Not Found',
        statusCode: 404
      }
    }
  })
  async create(@Body(ValidationPipe) createShopDto: CreateShopDto) {
    return this.shopsService.create(createShopDto);
  }

  @Patch(':id/credentials')
  @ApiOperation({
    summary: 'Обновить учетные данные магазина',
    description: 'Обновление логина и/или пароля для входа в систему от имени магазина. Пароль автоматически хешируется. Новый логин должен быть уникальным.'
  })
  @ApiResponse({
    status: 200,
    description: 'Учетные данные успешно обновлены',
    schema: {
      example: {
        id: 'a96e7bad-d4d8-4559-b9b7-0e180fedd3e3',
        name: 'Магазин "Продукты 24"',
        login: 'shop_products24_new',
        updatedAt: '2025-10-21T14:35:00.000Z'
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Новый логин уже используется другим магазином',
    schema: {
      example: {
        message: 'Login already in use',
        error: 'Bad Request',
        statusCode: 400
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Магазин не найден',
    schema: {
      example: {
        message: 'Shop not found',
        error: 'Not Found',
        statusCode: 404
      }
    }
  })
  async updateCredentials(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCredentialsDto: UpdateShopCredentialsDto,
  ) {
    return this.shopsService.updateCredentials(id, updateCredentialsDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Удалить магазин',
    description: 'Удаление магазина из системы. При удалении магазина все привязанные к нему терминалы теряют связь с магазином (shopId устанавливается в null), но сами терминалы не удаляются.'
  })
  @ApiResponse({
    status: 200,
    description: 'Магазин успешно удален',
    schema: {
      example: {
        message: 'Shop deleted successfully',
        id: 'a96e7bad-d4d8-4559-b9b7-0e180fedd3e3'
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Магазин не найден',
    schema: {
      example: {
        message: 'Shop not found',
        error: 'Not Found',
        statusCode: 404
      }
    }
  })
  async delete(@Param('id') id: string) {
    return this.shopsService.delete(id);
  }
}
