import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ApiOperation({ summary: 'Create a book' })
  @ApiResponse({
    status: 201,
    description: 'Book is created successfully.',
  })
  @Post()
  create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.booksService.create(createBookDto);
  }

  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({
    status: 200,
    description: 'Books are returned successfully.',
  })
  @Get()
  findAll(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  @ApiOperation({ summary: 'Get a book by book code' })
  @ApiResponse({
    status: 200,
    description: 'Book is returned successfully.',
  })
  @Get(':code')
  findOne(@Param('code') code: string): Promise<Book> {
    return this.booksService.findOneByCode(code);
  }

  @ApiOperation({ summary: 'Update a book by book code' })
  @ApiResponse({
    status: 200,
    description: 'Book is updated successfully.',
  })
  @Patch(':code')
  update(
    @Param('code') code: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return this.booksService.update(code, updateBookDto);
  }

  @ApiOperation({ summary: 'Delete a book by book code' })
  @ApiResponse({
    status: 200,
    description: 'Book is deleted successfully.',
  })
  @Delete(':code')
  remove(@Param('code') code: string): Promise<object> {
    return this.booksService.remove(code);
  }
}
