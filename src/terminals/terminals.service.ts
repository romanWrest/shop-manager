import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTerminalDto, UpdateTerminalDto, UpdateTerminalStatusDto, TerminalHeartbeatDto } from './dto/terminal.dto';

@Injectable()
export class TerminalsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.terminal.findMany({
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            address: true,
            login: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const terminal = await this.prisma.terminal.findUnique({
      where: { id },
      include: {
        shop: {
          include: {
            owner: true,
          },
        },
        requests: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!terminal) {
      throw new NotFoundException('Terminal not found');
    }

    return terminal;
  }

  async create(createTerminalDto: CreateTerminalDto) {
    const existingTerminal = await this.prisma.terminal.findUnique({
      where: { macAddress: createTerminalDto.macAddress },
    });

    if (existingTerminal) {
      throw new BadRequestException('Terminal with this MAC address already exists');
    }

    if (createTerminalDto.shopId) {
      const shop = await this.prisma.shop.findUnique({
        where: { id: createTerminalDto.shopId },
      });

      if (!shop) {
        throw new NotFoundException('Shop not found');
      }
    }

    return this.prisma.terminal.create({
      data: {
        macAddress: createTerminalDto.macAddress,
        shopId: createTerminalDto.shopId,
        status: createTerminalDto.shopId ? 'ACTIVE' : 'INACTIVE',
      },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    });
  }

  async update(id: string, updateTerminalDto: UpdateTerminalDto) {
    const terminal = await this.prisma.terminal.findUnique({
      where: { id },
    });

    if (!terminal) {
      throw new NotFoundException('Terminal not found');
    }

    if (updateTerminalDto.macAddress && updateTerminalDto.macAddress !== terminal.macAddress) {
      const existingTerminal = await this.prisma.terminal.findUnique({
        where: { macAddress: updateTerminalDto.macAddress },
      });

      if (existingTerminal) {
        throw new BadRequestException('Terminal with this MAC address already exists');
      }
    }

    if (updateTerminalDto.shopId) {
      const shop = await this.prisma.shop.findUnique({
        where: { id: updateTerminalDto.shopId },
      });

      if (!shop) {
        throw new NotFoundException('Shop not found');
      }
    }

    return this.prisma.terminal.update({
      where: { id },
      data: updateTerminalDto,
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    const terminal = await this.prisma.terminal.findUnique({
      where: { id },
    });

    if (!terminal) {
      throw new NotFoundException('Terminal not found');
    }

    await this.prisma.terminal.delete({
      where: { id },
    });

    return { message: 'Terminal deleted successfully' };
  }

  async updateStatus(id: string, updateStatusDto: UpdateTerminalStatusDto) {
    const terminal = await this.prisma.terminal.findUnique({
      where: { id },
    });

    if (!terminal) {
      throw new NotFoundException('Terminal not found');
    }

    return this.prisma.terminal.update({
      where: { id },
      data: { status: updateStatusDto.status },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    });
  }

  async heartbeat(heartbeatDto: TerminalHeartbeatDto) {
    const terminal = await this.prisma.terminal.findUnique({
      where: { macAddress: heartbeatDto.macAddress },
    });

    if (!terminal) {
      throw new NotFoundException('Terminal not found');
    }

    return this.prisma.terminal.update({
      where: { macAddress: heartbeatDto.macAddress },
      data: {
        status: 'ACTIVE',
        updatedAt: new Date(),
      },
      select: {
        id: true,
        macAddress: true,
        status: true,
        updatedAt: true,
      },
    });
  }
}
