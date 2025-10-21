import { IsEmail, IsString, MinLength, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({
    example: 'Имя Фамилия',
    description: 'Полное имя администратора'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'manager@example.com',
    description: 'Email администратора, unique'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Пароль (минимум 6 символов)'
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'newsecurepass456',
    description: 'Новый пароль (минимум 6 символов)'
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  newPassword: string;
}
