import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookLoanService } from './book-loan.service';
import { CreateBookLoanDto } from './dto/create-book-loan.dto';
import { UpdateBookLoanDto } from './dto/update-book-loan.dto';

@Controller('book-loan')
export class BookLoanController {
  constructor(private readonly bookLoanService: BookLoanService) {}

  @Post()
  create(@Body() createBookLoanDto: CreateBookLoanDto) {
    return this.bookLoanService.create(createBookLoanDto);
  }

  @Get()
  findAll() {
    return this.bookLoanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookLoanService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookLoanDto: UpdateBookLoanDto) {
    return this.bookLoanService.update(+id, updateBookLoanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookLoanService.remove(+id);
  }
}
