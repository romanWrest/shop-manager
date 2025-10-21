import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'changeMe', description: 'Текущий пароль' })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ example: 'newPassword', description: 'Новый пароль (минимум 6 символов)' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  newPassword: string;
}
