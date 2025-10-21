import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TerminalsService } from './terminals.service';
import { CreateTerminalDto, UpdateTerminalDto, UpdateTerminalStatusDto, TerminalHeartbeatDto } from './dto/terminal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Терминалы')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('terminals')
export class TerminalsController {
  constructor(private terminalsService: TerminalsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROOT', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить список терминалов' })
  @ApiResponse({ status: 200, description: 'Список терминалов' })
  async findAll() {
    return this.terminalsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROOT', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить карточку терминала' })
  @ApiResponse({ status: 200, description: 'Данные терминала' })
  @ApiResponse({ status: 404, description: 'Терминал не найден' })
  async findOne(@Param('id') id: string) {
    return this.terminalsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROOT', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать новый терминал' })
  @ApiResponse({ status: 201, description: 'Терминал создан' })
  async create(@Body(ValidationPipe) createTerminalDto: CreateTerminalDto) {
    return this.terminalsService.create(createTerminalDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROOT', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить терминал' })
  @ApiResponse({ status: 200, description: 'Терминал обновлен' })
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTerminalDto: UpdateTerminalDto,
  ) {
    return this.terminalsService.update(id, updateTerminalDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROOT', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Обновить статус терминала вручную',
    description: 'Ручное изменение статуса терминала (ACTIVE/INACTIVE). Используется для тестирования или административных целей. Требует роль ROOT или MANAGER.'
  })
  @ApiResponse({
    status: 200,
    description: 'Статус терминала успешно обновлен',
    schema: {
      example: {
        id: '0bd492c9-5d78-428d-8ef3-3d5ece1296c6',
        macAddress: 'FF:EE:DD:CC:BB:AA',
        status: 'INACTIVE',
        shopId: 'a96e7bad-d4d8-4559-b9b7-0e180fedd3e3',
        createdAt: '2025-10-19T22:45:05.685Z',
        updatedAt: '2025-10-19T22:46:56.829Z',
        shop: {
          id: 'a96e7bad-d4d8-4559-b9b7-0e180fedd3e3',
          name: 'Test Shop',
          address: '123 Test St'
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Терминал не найден',
    schema: {
      example: {
        message: 'Terminal not found',
        error: 'Not Found',
        statusCode: 404
      }
    }
  })
  async updateStatus(
    @Param('id') id: string,
    @Body(ValidationPipe) updateStatusDto: UpdateTerminalStatusDto,
  ) {
    return this.terminalsService.updateStatus(id, updateStatusDto);
  }

  @Post('alive')
  @ApiOperation({
    summary: 'Heartbeat от терминала',
    description: 'Эндпоинт для получения heartbeat-сигнала от терминала. Автоматически обновляет статус на ACTIVE и время последнего обновления. НЕ требует авторизации (публичный эндпоинт для терминалов).'
  })
  @ApiResponse({
    status: 200,
    description: 'Heartbeat получен, статус обновлен на ACTIVE',
    schema: {
      example: {
        id: '0bd492c9-5d78-428d-8ef3-3d5ece1296c6',
        macAddress: 'FF:EE:DD:CC:BB:AA',
        status: 'ACTIVE',
        updatedAt: '2025-10-19T22:47:03.545Z'
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Терминал с указанным MAC адресом не найден',
    schema: {
      example: {
        message: 'Terminal not found',
        error: 'Not Found',
        statusCode: 404
      }
    }
  })
  async heartbeat(@Body(ValidationPipe) heartbeatDto: TerminalHeartbeatDto) {
    return this.terminalsService.heartbeat(heartbeatDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROOT', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить терминал' })
  @ApiResponse({ status: 200, description: 'Терминал удален' })
  async delete(@Param('id') id: string) {
    return this.terminalsService.delete(id);
  }
}
