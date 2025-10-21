import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestDto {
  @ApiProperty({ example: 'uuid-terminal-id', description: 'ID терминала' })
  @IsString()
  @IsNotEmpty()
  terminalId: string;

  @ApiProperty({ example: 'shop1', description: 'Логин магазина' })
  @IsString()
  @IsNotEmpty()
  shopLogin: string;
}

export class UpdateRequestStatusDto {
  @ApiProperty({ example: 'APPROVED', enum: ['APPROVED', 'REJECTED'] })
  @IsEnum(['APPROVED', 'REJECTED'])
  @IsNotEmpty()
  status: 'APPROVED' | 'REJECTED';
}

export class AddCommentDto {
  @ApiProperty({ example: 'Заявка одобрена после проверки документов', description: 'Комментарий к заявке' })
  @IsString()
  @IsNotEmpty()
  comment: string;
}
