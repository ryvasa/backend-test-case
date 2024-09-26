import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMemberDto {
  @ApiProperty({ example: 'M001' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ example: 'Angga' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
