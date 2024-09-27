import { PartialType } from '@nestjs/swagger';
import { CreateBookLoanDto } from './create-book-loan.dto';

export class UpdateBookLoanDto extends PartialType(CreateBookLoanDto) {}
