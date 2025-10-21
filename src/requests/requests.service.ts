import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestDto, UpdateRequestStatusDto, AddCommentDto } from './dto/request.dto';

@Injectable()
export class RequestsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.request.findMany({
      include: {
        terminal: {
          select: {
            id: true,
            macAddress: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const request = await this.prisma.request.findUnique({
      where: { id },
      include: {
        terminal: {
          include: {
            shop: true,
          },
        },
      },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    return request;
  }

  async create(createRequestDto: CreateRequestDto) {
    const terminal = await this.prisma.terminal.findUnique({
      where: { id: createRequestDto.terminalId },
    });

    if (!terminal) {
      throw new NotFoundException('Terminal not found');
    }

    const shop = await this.prisma.shop.findUnique({
      where: { login: createRequestDto.shopLogin },
    });

    if (!shop) {
      throw new NotFoundException('Shop not found with provided login');
    }

    const existingRequest = await this.prisma.request.findFirst({
      where: {
        terminalId: createRequestDto.terminalId,
        status: 'PENDING',
      },
    });

    if (existingRequest) {
      throw new BadRequestException('There is already a pending request for this terminal');
    }

    return this.prisma.request.create({
      data: {
        terminalId: createRequestDto.terminalId,
        shopLogin: createRequestDto.shopLogin,
      },
      include: {
        terminal: {
          select: {
            id: true,
            macAddress: true,
            status: true,
          },
        },
      },
    });
  }

  async approve(id: string) {
    const request = await this.prisma.request.findUnique({
      where: { id },
      include: {
        terminal: true,
      },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException('Request has already been processed');
    }

    const shop = await this.prisma.shop.findUnique({
      where: { login: request.shopLogin },
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    await this.prisma.$transaction([
      this.prisma.request.update({
        where: { id },
        data: { status: 'APPROVED' },
      }),
      this.prisma.terminal.update({
        where: { id: request.terminalId },
        data: {
          shopId: shop.id,
          status: 'ACTIVE',
        },
      }),
    ]);

    return {
      message: 'Request approved and terminal connected to shop',
      status: 'APPROVED',
    };
  }

  async reject(id: string) {
    const request = await this.prisma.request.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException('Request has already been processed');
    }

    await this.prisma.request.update({
      where: { id },
      data: { status: 'REJECTED' },
    });

    return {
      message: 'Request rejected',
      status: 'REJECTED',
    };
  }

  async addComment(id: string, addCommentDto: AddCommentDto) {
    const request = await this.prisma.request.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    const updatedRequest = await this.prisma.request.update({
      where: { id },
      data: { comment: addCommentDto.comment },
      include: {
        terminal: {
          select: {
            id: true,
            macAddress: true,
            status: true,
          },
        },
      },
    });

    return updatedRequest;
  }

  async updateStatus(id: string, updateStatusDto: UpdateRequestStatusDto) {
    if (updateStatusDto.status === 'APPROVED') {
      return this.approve(id);
    } else {
      return this.reject(id);
    }
  }

  async delete(id: string) {
    const request = await this.prisma.request.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    await this.prisma.request.delete({
      where: { id },
    });

    return { message: 'Request deleted successfully' };
  }
}
