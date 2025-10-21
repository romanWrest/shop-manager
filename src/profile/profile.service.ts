import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async changePassword(userId: string, userRole: string | undefined, changePasswordDto: ChangePasswordDto) {
    if (userRole) {
      const admin = await this.prisma.admin.findUnique({
        where: { id: userId },
      });

      if (!admin) {
        throw new NotFoundException('Администратор не найден');
      }

      const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, admin.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Неверный текущий пароль');
      }

      const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

      await this.prisma.admin.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
          token: null,
        },
      });

      return {
        message: 'Пароль успешно изменен. Пожалуйста, войдите заново.',
      };
    } else {
      const shop = await this.prisma.shop.findUnique({
        where: { id: userId },
      });

      if (!shop) {
        throw new NotFoundException('Магазин не найден');
      }

      const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, shop.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Неверный текущий пароль');
      }

      const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

      await this.prisma.shop.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
        },
      });

      return {
        message: 'Пароль успешно изменен. Пожалуйста, войдите заново.',
      };
    }
  }
}
