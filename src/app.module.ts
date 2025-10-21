import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';
import { ShopOwnersModule } from './shop-owners/shop-owners.module';
import { ShopsModule } from './shops/shops.module';
import { TerminalsModule } from './terminals/terminals.module';
import { RequestsModule } from './requests/requests.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AdminsModule,
    ShopOwnersModule,
    ShopsModule,
    TerminalsModule,
    RequestsModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
