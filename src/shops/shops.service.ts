import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShopDto, UpdateShopCredentialsDto } from './dto/shop.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ShopsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.shop.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        terminals: {
          select: {
            id: true,
            macAddress: true,
            status: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { id },
      include: {
        owner: true,
        terminals: true,
      },
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    return shop;
  }

  async create(createShopDto: CreateShopDto) {
    const owner = await this.prisma.shopOwner.findUnique({
      where: { id: createShopDto.ownerId },
    });

    if (!owner) {
      throw new NotFoundException('Shop owner not found');
    }

    const existingShop = await this.prisma.shop.findUnique({
      where: { login: createShopDto.login },
    });

    if (existingShop) {
      throw new BadRequestException('Shop with this login already exists');
    }

    const hashedPassword = await bcrypt.hash(createShopDto.password, 10);

    const shop = await this.prisma.shop.create({
      data: {
        name: createShopDto.name,
        address: createShopDto.address,
        inn: createShopDto.inn,
        kpp: createShopDto.kpp,
        ogrn: createShopDto.ogrn,
        login: createShopDto.login,
        password: hashedPassword,
        ownerId: createShopDto.ownerId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    return {
      name: shop.name,
      address: shop.address,
      inn: shop.inn,
      kpp: shop.kpp,
      ogrn: shop.ogrn,
      login: shop.login,
      ownerId: shop.ownerId,
    };
  }


  async updateCredentials(id: string, updateCredentialsDto: UpdateShopCredentialsDto) {
    const shop = await this.prisma.shop.findUnique({
      where: { id },
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const updateData: any = {};

    if (updateCredentialsDto.login) {
      const existingShop = await this.prisma.shop.findUnique({
        where: { login: updateCredentialsDto.login },
      });

      if (existingShop && existingShop.id !== id) {
        throw new BadRequestException('Shop with this login already exists');
      }

      updateData.login = updateCredentialsDto.login;
    }

    if (updateCredentialsDto.password) {
      updateData.password = await bcrypt.hash(updateCredentialsDto.password, 10);
    }

    await this.prisma.shop.update({
      where: { id },
      data: updateData,
    });

    return { message: 'Credentials updated successfully' };
  }

  async delete(id: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { id },
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    await this.prisma.shop.delete({
      where: { id },
    });

    return { message: 'Shop deleted successfully' };
  }
}
