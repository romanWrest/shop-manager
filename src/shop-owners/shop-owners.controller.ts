import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ShopOwnersService } from './shop-owners.service';
import { CreateShopOwnerDto, UpdateShopOwnerDto } from './dto/shop-owner.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('shops-owners')
@ApiTags("Владельцы магазинов")
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ROOT', 'MANAGER')
export class ShopOwnersController {
  constructor(private shopOwnersService: ShopOwnersService) {}

  @Get()
  @ApiOperation({
    summary: 'Получить список всех владельцев магазинов',
    description: 'Возвращает список всех владельцев магазинов с информацией об их магазинах. Требует роль ROOT или MANAGER.'
  })
  @ApiResponse({
    status: 200,
    description: 'Список владельцев успешно получен',
    schema: {
      example: [
        {
          id: 'f5b9e8a1-3c4d-4e5f-9a8b-7c6d5e4f3a2b',
          name: 'Иванов Иван Иванович',
          phone: '+79991234567',
          email: 'ivanov@example.com',
          address: 'г. Москва, ул. Пушкина, д. 5, кв. 10',
          inn: '771234567890',
          createdAt: '2025-10-19T10:00:00.000Z',
          updatedAt: '2025-10-19T10:00:00.000Z',
          shops: [
            {
              id: 'a96e7bad-d4d8-4559-b9b7-0e180fedd3e3',
              name: 'Магазин "Продукты 24"',
              address: 'г. Москва, ул. Ленина, д. 10',
              login: 'shop_products24'
            }
          ]
        }
      ]
    }
  })
  async findAll() {
    return this.shopOwnersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Получить информацию о владельце по ID',
    description: 'Возвращает детальную информацию о конкретном владельце магазина, включая список всех его магазинов.'
  })
  @ApiResponse({
    status: 200,
    description: 'Информация о владельце успешно получена',
    schema: {
      example: {
        id: 'f5b9e8a1-3c4d-4e5f-9a8b-7c6d5e4f3a2b',
        name: 'Иванов Иван Иванович',
        phone: '+79991234567',
        email: 'ivanov@example.com',
        address: 'г. Москва, ул. Пушкина, д. 5, кв. 10',
        inn: '771234567890',
        createdAt: '2025-10-19T10:00:00.000Z',
        updatedAt: '2025-10-19T10:00:00.000Z',
        shops: [
          {
            id: 'a96e7bad-d4d8-4559-b9b7-0e180fedd3e3',
            name: 'Магазин "Продукты 24"',
            address: 'г. Москва, ул. Ленина, д. 10',
            inn: '7707083893',
            login: 'shop_products24'
          }
        ]
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Владелец не найден',
    schema: {
      example: {
        message: 'Shop owner not found',
        error: 'Not Found',
        statusCode: 404
      }
    }
  })
  async findOne(@Param('id') id: string) {
    return this.shopOwnersService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Создать нового владельца магазинов',
    description: 'Создание нового владельца магазинов в системе. Обязательные поля: имя и телефон. Email, адрес и ИНН необязательны.'
  })
  @ApiResponse({
    status: 201,
    description: 'Владелец успешно создан',
    schema: {
      example: {
        id: 'f5b9e8a1-3c4d-4e5f-9a8b-7c6d5e4f3a2b',
        name: 'Иванов Иван Иванович',
        phone: '+79991234567',
        email: 'ivanov@example.com',
        address: 'г. Москва, ул. Пушкина, д. 5, кв. 10',
        inn: '771234567890',
        createdAt: '2025-10-19T10:00:00.000Z',
        updatedAt: '2025-10-19T10:00:00.000Z',
        shops: []
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные (например, неверный формат телефона или email)',
    schema: {
      example: {
        message: ['phone must be a valid phone number', 'email must be an email'],
        error: 'Bad Request',
        statusCode: 400
      }
    }
  })
  async create(@Body(ValidationPipe) createShopOwnerDto: CreateShopOwnerDto) {
    return this.shopOwnersService.create(createShopOwnerDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Обновить информацию о владельце',
    description: 'Обновление данных владельца магазинов (имя, телефон, email, адрес, ИНН). Все поля опциональны при обновлении.'
  })
  @ApiResponse({
    status: 200,
    description: 'Информация о владельце успешно обновлена',
    schema: {
      example: {
        id: 'f5b9e8a1-3c4d-4e5f-9a8b-7c6d5e4f3a2b',
        name: 'Иванов Иван Петрович',
        phone: '+79991234567',
        email: 'ivanov.new@example.com',
        address: 'г. Москва, ул. Пушкина, д. 5, кв. 10',
        inn: '771234567890',
        createdAt: '2025-10-19T10:00:00.000Z',
        updatedAt: '2025-10-21T15:00:00.000Z'
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные',
    schema: {
      example: {
        message: ['email must be an email'],
        error: 'Bad Request',
        statusCode: 400
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Владелец не найден',
    schema: {
      example: {
        message: 'Shop owner not found',
        error: 'Not Found',
        statusCode: 404
      }
    }
  })
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateShopOwnerDto: UpdateShopOwnerDto,
  ) {
    return this.shopOwnersService.update(id, updateShopOwnerDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Удалить владельца магазинов',
    description: 'Удаление владельца из системы. ВНИМАНИЕ: При удалении владельца все связанные с ним магазины также будут удалены (каскадное удаление). Терминалы магазинов не удаляются, но теряют связь с магазином.'
  })
  @ApiResponse({
    status: 200,
    description: 'Владелец успешно удален',
    schema: {
      example: {
        message: 'Shop owner deleted successfully',
        id: 'f5b9e8a1-3c4d-4e5f-9a8b-7c6d5e4f3a2b'
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Владелец не найден',
    schema: {
      example: {
        message: 'Shop owner not found',
        error: 'Not Found',
        statusCode: 404
      }
    }
  })
  async delete(@Param('id') id: string) {
    return this.shopOwnersService.delete(id);
  }
}
