import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { PenaltyModule } from './penalty/penalty.module';
import { BookLoanModule } from './book-loan/book-loan.module';
import { BooksModule } from './books/books.module';
import { MembersModule } from './members/members.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    BooksModule,
    MembersModule,
    PenaltyModule,
    BookLoanModule,
  ],
})
export class AppModule {}
