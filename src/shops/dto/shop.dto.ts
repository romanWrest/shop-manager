import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShopDto {
  @ApiProperty({
    example: 'Магазин "Продукты 24"',
    description: 'Наименование торговой точки'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'г. Москва, ул. Тверская, д. 5',
    description: 'Адрес магазина'
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: '7707083893',
    description: 'ИНН организации (10 или 12 цифр)'
  })
  @IsString()
  @IsNotEmpty()
  inn: string;

  @ApiProperty({
    example: '770701001',
    description: 'КПП (для юридических лиц)',
    required: false
  })
  @IsString()
  @IsOptional()
  kpp?: string;

  @ApiProperty({
    example: '1027700132195',
    description: 'ОГРН (для юридических лиц)',
    required: false
  })
  @IsString()
  @IsOptional()
  ogrn?: string;

  @ApiProperty({
    example: 'shop',
    description: 'Логин для входа в систему (должен быть уникальным)'
  })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({
    example: '123456',
    description: 'Пароль для входа (минимум 6 символов)'
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'adcbd5f2-6b80-4987-9035-11f868b073a3',
    description: 'ID владельца магазина (UUID)'
  })
  @IsString()
  @IsNotEmpty()
  ownerId: string;
}

export class UpdateShopCredentialsDto {
  @IsString()
  @IsOptional()
  login?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;
}
