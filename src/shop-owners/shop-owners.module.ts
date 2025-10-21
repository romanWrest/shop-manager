import { Module } from '@nestjs/common';
import { ShopOwnersController } from './shop-owners.controller';
import { ShopOwnersService } from './shop-owners.service';

@Module({
  controllers: [ShopOwnersController],
  providers: [ShopOwnersService],
})
export class ShopOwnersModule {}
