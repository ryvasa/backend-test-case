import { forwardRef, Module } from '@nestjs/common';
import { BookLoansService } from './book-loans.service';
import { BookLoansController } from './book-loans.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookLoan } from './entities/book-loan.entity';
import { BooksModule } from 'src/books/books.module';
import { MembersModule } from 'src/members/members.module';
import { PenaltiesModule } from 'src/penalties/penalties.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookLoan]),
    BooksModule,
    MembersModule,
    forwardRef(() => PenaltiesModule),
  ],
  controllers: [BookLoansController],
  providers: [BookLoansService],
  exports: [BookLoansService],
})
export class BookLoansModule {}
