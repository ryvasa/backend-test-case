import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import {
  BookMessageResponseDto,
  BookResponseDto,
  BooksResponseDto,
  CreateBookDto,
  UpdateBookDto,
} from './dto';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ApiOperation({ summary: 'Create a book' })
  @ApiResponse({
    status: 201,
    description: 'Book is created successfully.',
    type: BookResponseDto,
  })
  @Post()
  createBook(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.booksService.addBook(createBookDto);
  }

  @ApiOperation({ summary: 'Get all avaible books (Check the book)' })
  @ApiResponse({
    status: 200,
    description: 'Books are returned successfully.',
    type: BooksResponseDto,
  })
  @Get()
  findAllBooks(): Promise<Book[]> {
    return this.booksService.findAllBook();
  }

  @ApiOperation({ summary: 'Get a book' })
  @ApiResponse({
    status: 200,
    description: 'Book is returned successfully.',
    type: BookResponseDto,
  })
  @Get(':code')
  findOneBook(@Param('code') code: string): Promise<Book> {
    return this.booksService.findOneBook(code);
  }

  @ApiOperation({ summary: 'Update a book' })
  @ApiResponse({
    status: 200,
    description: 'Book is updated successfully.',
    type: BookResponseDto,
  })
  @Patch(':code')
  updateBook(
    @Param('code') code: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return this.booksService.updateBook(code, updateBookDto);
  }

  @ApiOperation({ summary: 'Delete a book' })
  @ApiResponse({
    status: 200,
    description: 'Book is deleted successfully.',
    type: BookMessageResponseDto,
  })
  @Delete(':code')
  deleteBook(@Param('code') code: string): Promise<object> {
    return this.booksService.deleteBook(code);
  }
}
