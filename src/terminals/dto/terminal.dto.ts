import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTerminalDto {
  @ApiProperty({ example: 'AA:BB:CC:DD:EE:FF', description: 'MAC адрес терминала' })
  @IsString()
  @IsNotEmpty()
  macAddress: string;

  @ApiProperty({ example: 'uuid-shop-id', required: false, description: 'ID магазина' })
  @IsString()
  @IsOptional()
  shopId?: string;
}

export class UpdateTerminalDto {
  @ApiProperty({ example: 'AA:BB:CC:DD:EE:FF', required: false })
  @IsString()
  @IsOptional()
  macAddress?: string;

  @ApiProperty({ example: 'ACTIVE', enum: ['ACTIVE', 'INACTIVE'], required: false })
  @IsEnum(['ACTIVE', 'INACTIVE'])
  @IsOptional()
  status?: 'ACTIVE' | 'INACTIVE';

  @ApiProperty({ example: 'uuid-shop-id', required: false })
  @IsString()
  @IsOptional()
  shopId?: string;
}

export class UpdateTerminalStatusDto {
  @ApiProperty({ example: 'ACTIVE', enum: ['ACTIVE', 'INACTIVE'], description: 'Новый статус терминала' })
  @IsEnum(['ACTIVE', 'INACTIVE'])
  @IsNotEmpty()
  status: 'ACTIVE' | 'INACTIVE';
}

export class TerminalHeartbeatDto {
  @ApiProperty({ example: 'AA:BB:CC:DD:EE:FF', description: 'MAC адрес терминала' })
  @IsString()
  @IsNotEmpty()
  macAddress: string;
}
