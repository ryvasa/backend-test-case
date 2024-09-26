import { Injectable } from '@nestjs/common';
import { CreateBookLoanDto } from './dto/create-book-loan.dto';
import { UpdateBookLoanDto } from './dto/update-book-loan.dto';

@Injectable()
export class BookLoanService {
  create(createBookLoanDto: CreateBookLoanDto) {
    return 'This action adds a new bookLoan';
  }

  findAll() {
    return `This action returns all bookLoan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bookLoan`;
  }

  update(id: number, updateBookLoanDto: UpdateBookLoanDto) {
    return `This action updates a #${id} bookLoan`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookLoan`;
  }
}
