import { forwardRef, Module } from '@nestjs/common';
import { PenaltiesService } from './penalties.service';
import { PenaltiesController } from './penalties.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Penalty } from './entities/penalty.entity';
import { MembersModule } from 'src/members/members.module';
import { BookLoan } from 'src/book-loans/entities/book-loan.entity';
import { BookLoansModule } from 'src/book-loans/book-loans.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Penalty, BookLoan]),
    MembersModule,
    forwardRef(() => BookLoansModule),
  ],
  controllers: [PenaltiesController],
  providers: [PenaltiesService],
  exports: [PenaltiesService],
})
export class PenaltiesModule {}
