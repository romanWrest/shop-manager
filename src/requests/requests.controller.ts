import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RequestsService } from './requests.service';
import { CreateRequestDto, AddCommentDto } from './dto/request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Заявки')
@ApiBearerAuth('JWT-auth')
@Controller('requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RequestsController {
  constructor(private requestsService: RequestsService) {}

  @Get()
  @Roles('ROOT', 'MANAGER')
  @ApiOperation({
    summary: 'Получить список заявок',
    description: 'Возвращает список всех заявок на подключение терминалов к магазинам. Доступно для администраторов(ROOT и MANAGER)'
  })
  @ApiResponse({
    status: 200,
    description: 'Список заявок',
    schema: {
      example: [
        {
          id: 'b0816217-c88f-402f-9c26-de995d57ad86',
          terminalId: '0bd492c9-5d78-428d-8ef3-3d5ece1296c6',
          shopLogin: 'testshop1',
          status: 'PENDING',
          comment: 'Заявка проверена, все документы в порядке',
          createdAt: '2025-10-19T22:45:37.148Z',
          updatedAt: '2025-10-19T22:45:47.884Z',
          terminal: {
            id: '0bd492c9-5d78-428d-8ef3-3d5ece1296c6',
            macAddress: 'FF:EE:DD:CC:BB:AA',
            status: 'ACTIVE'
          }
        }
      ]
    }
  })
  async findAll() {
    return this.requestsService.findAll();
  }

  @Get(':id')
  @Roles('ROOT', 'MANAGER')
  @ApiOperation({
    summary: 'Получить заявку по ID',
    description: 'Возвращает детальную информацию о конкретной заявке по её ID.'
  })
  @ApiResponse({
    status: 200,
    description: 'Данные заявки',
    schema: {
      example: {
        id: 'b0816217-c88f-402f-9c26-de995d57ad86',
        terminalId: '0bd492c9-5d78-428d-8ef3-3d5ece1296c6',
        shopLogin: 'testshop1',
        status: 'PENDING',
        comment: null,
        createdAt: '2025-10-19T22:45:37.148Z',
        updatedAt: '2025-10-19T22:45:37.148Z',
        terminal: {
          id: '0bd492c9-5d78-428d-8ef3-3d5ece1296c6',
          macAddress: 'FF:EE:DD:CC:BB:AA',
          status: 'ACTIVE'
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Заявка не найдена',
    schema: {
      example: {
        message: 'Request not found',
        error: 'Not Found',
        statusCode: 404
      }
    }
  })
  async findOne(@Param('id') id: string) {
    return this.requestsService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Создать новую заявку',
    description: 'Создание заявки на подключение терминала к магазину. Заявка создается в статусе PENDING.'
  })
  @ApiResponse({
    status: 201,
    description: 'Заявка создана',
    schema: {
      example: {
        id: 'b0816217-c88f-402f-9c26-de995d57ad86',
        terminalId: '0bd492c9-5d78-428d-8ef3-3d5ece1296c6',
        shopLogin: 'testshop1',
        status: 'PENDING',
        comment: null,
        createdAt: '2025-10-19T22:45:37.148Z',
        updatedAt: '2025-10-19T22:45:37.148Z',
        terminal: {
          id: '0bd492c9-5d78-428d-8ef3-3d5ece1296c6',
          macAddress: 'FF:EE:DD:CC:BB:AA',
          status: 'ACTIVE'
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные или заявка уже существует',
    schema: {
      example: {
        message: 'Request already exists for this terminal and shop',
        error: 'Bad Request',
        statusCode: 400
      }
    }
  })
  async create(@Body(ValidationPipe) createRequestDto: CreateRequestDto) {
    return this.requestsService.create(createRequestDto);
  }

  @Patch(':id/approve')
  @Roles('ROOT', 'MANAGER')
  @ApiOperation({
    summary: 'Одобрить заявку',
    description: 'Одобрение заявки на подключение. Терминал автоматически привязывается к магазину (атомарная операция в транзакции). Статус заявки меняется на APPROVED.'
  })
  @ApiResponse({
    status: 200,
    description: 'Заявка одобрена, терминал подключен к магазину',
    schema: {
      example: {
        message: 'Request approved and terminal connected to shop',
        status: 'APPROVED'
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Заявка уже обработана',
    schema: {
      example: {
        message: 'Request has already been processed',
        error: 'Bad Request',
        statusCode: 400
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Заявка не найдена',
    schema: {
      example: {
        message: 'Request not found',
        error: 'Not Found',
        statusCode: 404
      }
    }
  })
  async approve(@Param('id') id: string) {
    return this.requestsService.approve(id);
  }

  @Patch(':id/reject')
  @Roles('ROOT', 'MANAGER')
  @ApiOperation({
    summary: 'Отклонить заявку',
    description: 'Отклонение заявки на подключение терминала. Статус заявки меняется на REJECTED. Терминал остается не привязанным к магазину.'
  })
  @ApiResponse({
    status: 200,
    description: 'Заявка отклонена',
    schema: {
      example: {
        message: 'Request rejected',
        status: 'REJECTED'
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Заявка уже обработана',
    schema: {
      example: {
        message: 'Request has already been processed',
        error: 'Bad Request',
        statusCode: 400
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Заявка не найдена',
    schema: {
      example: {
        message: 'Request not found',
        error: 'Not Found',
        statusCode: 404
      }
    }
  })
  async reject(@Param('id') id: string) {
    return this.requestsService.reject(id);
  }

  @Post(':id/comment')
  @ApiOperation({
    summary: 'Добавить комментарий к заявке',
    description: 'Добавление или обновление комментария к заявке. Комментарий может содержать причину одобрения/отклонения или дополнительные замечания.'
  })
  @ApiResponse({
    status: 200,
    description: 'Комментарий добавлен',
    schema: {
      example: {
        id: 'b0816217-c88f-402f-9c26-de995d57ad86',
        terminalId: '0bd492c9-5d78-428d-8ef3-3d5ece1296c6',
        shopLogin: 'testshop1',
        status: 'PENDING',
        comment: 'Заявка проверена, все документы в порядке',
        createdAt: '2025-10-19T22:45:37.148Z',
        updatedAt: '2025-10-19T22:45:47.884Z',
        terminal: {
          id: '0bd492c9-5d78-428d-8ef3-3d5ece1296c6',
          macAddress: 'FF:EE:DD:CC:BB:AA',
          status: 'ACTIVE'
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Заявка не найдена',
    schema: {
      example: {
        message: 'Request not found',
        error: 'Not Found',
        statusCode: 404
      }
    }
  })
  async addComment(
    @Param('id') id: string,
    @Body(ValidationPipe) addCommentDto: AddCommentDto,
  ) {
    return this.requestsService.addComment(id, addCommentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить заявку' })
  @ApiResponse({ status: 200, description: 'Заявка удалена' })
  async delete(@Param('id') id: string) {
    return this.requestsService.delete(id);
  }
}
