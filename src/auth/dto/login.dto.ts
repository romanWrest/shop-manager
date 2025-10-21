import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAdminDto {
  @ApiProperty({ example: 'root@example.com', description: 'Email администратора' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456', description: 'Пароль (минимум 6 символов)' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}

export class LoginShopDto {
  @ApiProperty({ example: 'shop1', description: 'Логин магазина' })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({ example: 'shoppass123', description: 'Пароль (минимум 6 символов)' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT токен для обновления'
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
