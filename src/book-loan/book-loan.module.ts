import { Module } from '@nestjs/common';
import { BookLoanService } from './book-loan.service';
import { BookLoanController } from './book-loan.controller';

@Module({
  controllers: [BookLoanController],
  providers: [BookLoanService],
})
export class BookLoanModule {}
