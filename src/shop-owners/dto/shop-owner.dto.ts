import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShopOwnerDto {
  @ApiProperty({
    example: 'ИП Иванов Иван Иванович',
    description: 'Полное наименование владельца магазина (ФИО или название организации)'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '+79001234567',
    description: 'Контактный телефон'
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 'ivanov@example.com',
    description: 'Email для связи',
    required: false
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'г. Ростов-на-Донц, ул. Соколова 76',
    description: 'Адрес регистрации владельца',
    required: false
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    example: '123456789012',
    description: 'ИНН (для юридических лиц и ИП)',
    required: false
  })
  @IsString()
  @IsOptional()
  inn?: string;
}

export class UpdateShopOwnerDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  inn?: string;
}
