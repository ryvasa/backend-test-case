import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { BookLoansService } from './book-loans.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookLoan } from './entities/book-loan.entity';
import {
  BookLoanJoinResponseDto,
  BookLoanResponseDto,
  CreateBookLoanDto,
} from './dto';

@ApiTags('Book Loans')
@Controller('book-loans')
export class BookLoansController {
  constructor(private readonly bookLoansService: BookLoansService) {}

  @ApiOperation({
    summary: 'Create a book loan (Borrowing a book)',
    description: `Members who wish to borrow must not have 2 or more active loans and members must not be within the penalty period.`,
  })
  @ApiResponse({
    status: 201,
    description: 'Book loan is created successfully.',
    type: BookLoanJoinResponseDto,
  })
  @Post()
  createBookLoan(
    @Body() createBookLoanDto: CreateBookLoanDto,
  ): Promise<BookLoan> {
    return this.bookLoansService.borrowBook(createBookLoanDto);
  }

  @ApiOperation({
    summary: 'Update a book loan (Return  a book)',
    description: `If books are returned later than the expected return date, a penalty will apply.`,
  })
  @ApiResponse({
    status: 200,
    description: 'Book is return successfully.',
    type: BookLoanJoinResponseDto,
  })
  @Patch(':code/return')
  updateBookLoan(@Param('code') code: string): Promise<BookLoan> {
    return this.bookLoansService.returnBook(code);
  }

  @ApiOperation({ summary: 'Get all book loans' })
  @ApiResponse({
    status: 200,
    description: 'Book loans are returned successfully.',
    type: BookLoanResponseDto,
  })
  @Get()
  findAllBookLoan(): Promise<BookLoan[]> {
    return this.bookLoansService.findAllBookLoan();
  }
}
