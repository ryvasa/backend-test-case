import { ApiProperty } from '@nestjs/swagger';
import { BookLoanDto, BookLoanWithBookDto } from 'src/book-loans/dto';
import { MemberDto, MemberWithDateDto } from 'src/members/dto';

export class PenaltyDto {
  @ApiProperty({ example: 'P001' })
  code: string;

  @ApiProperty({ example: '2024-09-27T07:56:17.422Z' })
  penalty_start_date: Date;

  @ApiProperty({ example: '2024-09-30T14:56:17.529Z' })
  penalty_end_date: Date;
}

// MANY PENALTIES
export class PenaltiesResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'OK' })
  message: string;

  @ApiProperty({ type: [PenaltyDto] })
  data: [PenaltyDto];
}

export class PenaltyJoinDto {
  @ApiProperty({ example: 'P001' })
  code: string;

  @ApiProperty({ example: '2024-09-27T07:56:17.422Z' })
  penalty_start_date: Date;

  @ApiProperty({ example: '2024-09-30T14:56:17.529Z' })
  penalty_end_date: Date;

  @ApiProperty({ type: MemberDto })
  member: MemberDto;

  @ApiProperty({ type: BookLoanWithBookDto })
  book_loan: BookLoanWithBookDto;
}

export class PenaltyJoinResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'OK' })
  message: string;

  @ApiProperty({ type: PenaltyJoinDto })
  data: PenaltyJoinDto;
}

export class AddPenaltyDto {
  @ApiProperty({ example: 'P001' })
  code: string;

  @ApiProperty({ type: BookLoanDto })
  book_loan: BookLoanDto;

  @ApiProperty({ type: MemberWithDateDto })
  member: MemberWithDateDto;

  @ApiProperty({ example: '2024-09-27T07:56:17.422Z' })
  penalty_start_date: Date;

  @ApiProperty({ example: '2024-09-30T14:56:17.529Z' })
  penalty_end_date: Date;
}

export class AddPenaltyResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'OK' })
  message: string;

  @ApiProperty({ type: AddPenaltyDto })
  data: AddPenaltyDto;
}
