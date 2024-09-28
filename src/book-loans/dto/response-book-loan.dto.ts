import { ApiProperty } from '@nestjs/swagger';
import { BookDto, BookWithDateDto } from 'src/books/dto/response-book.dto';
import { MemberWithDateDto } from 'src/members/dto';

export class BookLoanWithBookDto {
  @ApiProperty({ example: 'L008' })
  code: string;

  @ApiProperty({ example: '2024-09-27T18:39:11.756Z' })
  borrowing_date: Date;

  @ApiProperty({ example: '2024-10-05T01:39:11.860Z' })
  expected_return_date: Date;

  @ApiProperty({ example: null })
  return_date: Date | null;

  @ApiProperty({ type: BookDto })
  book: BookDto;
}

export class BookLoanDto {
  @ApiProperty({ example: 'L008' })
  code: string;

  @ApiProperty({ example: '2024-09-27T18:39:11.756Z' })
  borrowing_date: Date;

  @ApiProperty({ example: '2024-10-05T01:39:11.860Z' })
  expected_return_date: Date;

  @ApiProperty({ example: null })
  return_date: Date | null;
}

// MANY BOOK LOANS
export class BookLoanResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'OK' })
  message: string;

  @ApiProperty({ type: [BookLoanDto] })
  data: BookLoanDto[];
}

// BOOK LOAN JOIN WIT BOOK MEMBER
export class BookLoanJoinDto {
  @ApiProperty({ type: BookWithDateDto })
  book: BookWithDateDto;

  @ApiProperty({ type: () => MemberWithDateDto })
  member: MemberWithDateDto;

  @ApiProperty({ example: 'L008' })
  code: string;

  @ApiProperty({ example: '2024-09-27T18:39:11.756Z' })
  borrowing_date: Date;

  @ApiProperty({ example: '2024-10-05T01:39:11.860Z' })
  expected_return_date: Date;

  @ApiProperty({ example: null })
  return_date: Date | null;
}
export class BookLoanJoinResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'OK' })
  message: string;

  @ApiProperty({ type: BookLoanJoinDto })
  data: BookLoanJoinDto;
}
