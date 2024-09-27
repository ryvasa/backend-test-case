import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBookLoanDto {
  @ApiProperty({ example: 'JK-45' })
  @IsNotEmpty()
  @IsString()
  book_code: string;

  @ApiProperty({ example: 'M001' })
  @IsNotEmpty()
  @IsString()
  member_code: string;
}
