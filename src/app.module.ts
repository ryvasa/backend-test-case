import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { BooksModule } from './books/books.module';
import { MembersModule } from './members/members.module';
import { PenaltiesModule } from './penalties/penalties.module';
import { BookLoansModule } from './book-loans/book-loans.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    BookLoansModule,
    BooksModule,
    MembersModule,
    PenaltiesModule,
  ],
})
export class AppModule {}
