import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShopOwnerDto, UpdateShopOwnerDto } from './dto/shop-owner.dto';

@Injectable()
export class ShopOwnersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.shopOwner.findMany({
      include: {
        shops: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const owner = await this.prisma.shopOwner.findUnique({
      where: { id },
      include: {
        shops: {
          include: {
            terminals: {
              select: {
                id: true,
                macAddress: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!owner) {
      throw new NotFoundException('Shop owner not found');
    }

    return owner;
  }

  async create(createShopOwnerDto: CreateShopOwnerDto) {
    return this.prisma.shopOwner.create({
      data: createShopOwnerDto,
    });
  }

  async update(id: string, updateShopOwnerDto: UpdateShopOwnerDto) {
    const owner = await this.prisma.shopOwner.findUnique({
      where: { id },
    });

    if (!owner) {
      throw new NotFoundException('Shop owner not found');
    }

    return this.prisma.shopOwner.update({
      where: { id },
      data: updateShopOwnerDto,
    });
  }

  async delete(id: string) {
    const owner = await this.prisma.shopOwner.findUnique({
      where: { id },
    });

    if (!owner) {
      throw new NotFoundException('Shop owner not found');
    }

    await this.prisma.shopOwner.delete({
      where: { id },
    });

    return { message: 'Shop owner deleted successfully' };
  }
}
