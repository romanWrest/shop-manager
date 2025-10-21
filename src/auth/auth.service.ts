import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async loginAdmin(email: string, password: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { sub: admin.id, email: admin.email, role: admin.role };
    const token = this.jwtService.sign(payload);

    await this.prisma.admin.update({
      where: { id: admin.id },
      data: { token },
    });

    return {
      access_token: token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    };
  }

  async loginShop(login: string, password: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { login },
    });

    if (!shop) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, shop.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: shop.id, login: shop.login, type: 'shop' };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      shop: {
        id: shop.id,
        name: shop.name,
        login: shop.login,
      },
    };
  }

  async validateAdminToken(token: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { token },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid token');
    }

    return admin;
  }

  async logout(userId: string, userRole?: string) {
    if (userRole) {
      await this.prisma.admin.update({
        where: { id: userId },
        data: { token: null },
      });
    }

    return { message: 'Вы успешно вышли из системы' };
  }

  async refreshToken(oldToken: string) {
    try {
      const payload = this.jwtService.verify(oldToken);

      if (payload.role) {
        const admin = await this.prisma.admin.findUnique({
          where: { id: payload.sub },
        });

        if (!admin) {
          throw new UnauthorizedException('Пользователь не найден');
        }

        if (admin.token !== oldToken) {
          throw new UnauthorizedException('Токен недействителен или была выполнена другая сессия');
        }

        const newPayload = { sub: admin.id, email: admin.email, role: admin.role };
        const newToken = this.jwtService.sign(newPayload);

        await this.prisma.admin.update({
          where: { id: admin.id },
          data: { token: newToken },
        });

        return {
          access_token: newToken,
          admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
          },
        };
      } else if (payload.type === 'shop') {
        const shop = await this.prisma.shop.findUnique({
          where: { id: payload.sub },
        });

        if (!shop) {
          throw new UnauthorizedException('Магазин не найден');
        }

        const newPayload = { sub: shop.id, login: shop.login, type: 'shop' };
        const newToken = this.jwtService.sign(newPayload);

        return {
          access_token: newToken,
          shop: {
            id: shop.id,
            name: shop.name,
            login: shop.login,
          },
        };
      }

      throw new UnauthorizedException('Неподдерживаемый тип токена');
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Недействительный или истекший токен');
    }
  }
}
