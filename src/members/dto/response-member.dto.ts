import { ApiProperty } from '@nestjs/swagger';
import { BookLoanDto, BookLoanWithBookDto } from 'src/book-loans/dto';

// ONE MEMBER
export class MemberWithDateDto {
  @ApiProperty({ example: 'M001' })
  code: string;

  @ApiProperty({ example: 'Angga' })
  name: string;

  @ApiProperty({ example: '2024-09-27T19:02:09.603Z' })
  creatd_at: Date;

  @ApiProperty({ example: '2024-09-27T19:02:09.603Z' })
  updated_at: Date;
}

export class MemberDto {
  @ApiProperty({ example: 'M001' })
  code: string;

  @ApiProperty({ example: 'Angga' })
  name: string;
}

export class MemberResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'OK' })
  message: string;

  @ApiProperty({ type: MemberWithDateDto })
  data: MemberWithDateDto;
}

// MANY MEMBERS WITH LOAN
export class MemberLoanDto {
  @ApiProperty({ example: 'M001' })
  code: string;

  @ApiProperty({ example: 'Angga' })
  name: string;

  @ApiProperty({ type: [BookLoanDto] })
  book_loans: BookLoanDto[];
}

export class MemberLoanResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'OK' })
  message: string;

  @ApiProperty({ type: [MemberLoanDto] })
  data: MemberLoanDto[];
}

// MANY MEMBERS WITH ACTIVE LOAN
export class MemberActiveLoanDto {
  @ApiProperty({ example: 'M001' })
  code: string;

  @ApiProperty({ example: 'Angga' })
  name: string;

  @ApiProperty({ type: [BookLoanWithBookDto] })
  book_loans: BookLoanWithBookDto[];

  @ApiProperty({ example: 1 })
  book_on_loan_count: number;
}

export class MemberActiveLoanResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'OK' })
  message: string;

  @ApiProperty({ type: [MemberActiveLoanDto] })
  data: MemberActiveLoanDto[];
}

// MEMBER MESSAGE
export class MemberMessageDto {
  @ApiProperty({ example: 'Member is deleted successfully.' })
  message: string;
}

export class MemberMessageResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'OK' })
  message: string;

  @ApiProperty({ type: MemberMessageDto })
  data: MemberMessageDto;
}
