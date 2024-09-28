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

  @ApiOperation({ summary: 'Create a book loan (Borrowing a book)' })
  @ApiResponse({
    status: 201,
    description: 'Book loan is created successfully.',
    type: BookLoanJoinResponseDto,
  })
  @Post()
  create(@Body() createBookLoanDto: CreateBookLoanDto): Promise<BookLoan> {
    return this.bookLoansService.borrowBook(createBookLoanDto);
  }

  @ApiOperation({ summary: 'Update a book loan (Return  a book)' })
  @ApiResponse({
    status: 200,
    description: 'Book is return successfully.',
    type: BookLoanJoinResponseDto,
  })
  @Patch(':code/return')
  update(@Param('code') code: string): Promise<BookLoan> {
    return this.bookLoansService.returnBook(code);
  }

  @ApiOperation({ summary: 'Get all book loans' })
  @ApiResponse({
    status: 200,
    description: 'Book loans are returned successfully.',
    type: BookLoanResponseDto,
  })
  @Get()
  findAll() {
    return this.bookLoansService.findAllBookLoan();
  }
}
