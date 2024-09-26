import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
  ) {}
  async create(createBookDto: CreateBookDto): Promise<Book> {
    const existBook: Book = await this.bookRepository.findOneBy({
      code: createBookDto.code,
    });
    if (existBook) {
      throw new NotFoundException(
        'Book already exists, you can change stok book',
      );
    }
    const book: Book = this.bookRepository.create(createBookDto);
    return await this.bookRepository.save(book);
  }

  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find();
  }

  async findOne(code: string): Promise<Book> {
    const book: Book = await this.bookRepository.findOneBy({ code });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async update(code: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book: Book = await this.findOne(code);
    Object.assign(book, updateBookDto);
    return this.bookRepository.save(book);
  }

  async remove(code: string): Promise<object> {
    const book: Book = await this.findOne(code);
    await this.bookRepository.remove(book);
    return { message: 'Book has been deleted' };
  }
}
