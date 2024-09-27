import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { BookLoansService } from './book-loans.service';
import { CreateBookLoanDto } from './dto/create-book-loan.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookLoan } from './entities/book-loan.entity';

@ApiTags('Book Loans')
@Controller('book-loans')
export class BookLoansController {
  constructor(private readonly bookLoansService: BookLoansService) {}

  @ApiOperation({ summary: 'Create a book loan (Borrowing a book)' })
  @ApiResponse({
    status: 201,
    description: 'Book loan is created successfully.',
  })
  @Post()
  create(@Body() createBookLoanDto: CreateBookLoanDto): Promise<BookLoan> {
    return this.bookLoansService.borrowBook(createBookLoanDto);
  }

  @ApiOperation({ summary: 'Update a book loan (Return  a book)' })
  @ApiResponse({
    status: 200,
    description: 'Book is return successfully.',
  })
  @Patch(':code/return')
  update(@Param('code') code: string): Promise<BookLoan> {
    return this.bookLoansService.returnBook(code);
  }

  @ApiOperation({ summary: 'Get all book loans' })
  @ApiResponse({
    status: 200,
    description: 'Book loans are returned successfully.',
  })
  @Get()
  findAll() {
    return this.bookLoansService.findAllBookLoan();
  }

  // @Get(':code')
  // findOne(@Param('code') code: string) {
  //   return this.bookLoansService.findOne(+code);
  // }

  // @Delete(':code')
  // remove(@Param('code') code: string) {
  //   return this.bookLoansService.remove(+code);
  // }
}
