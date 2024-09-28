import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePenaltyDto {
  @ApiProperty({ example: 'M001' })
  @IsNotEmpty()
  @IsString()
  member_code: string;

  @ApiProperty({ example: 'L001' })
  @IsNotEmpty()
  @IsString()
  book_loan_code: string;
}
