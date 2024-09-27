import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePenaltyDto {
  @IsNotEmpty()
  @IsString()
  member_code: string;

  @IsNotEmpty()
  @IsString()
  book_loan_code: string;
}
