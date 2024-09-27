import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { QueryRunner, Repository } from 'typeorm';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
  ) {}
  async create(
    createBookDto: CreateBookDto,
    queryRunner?: QueryRunner,
  ): Promise<Book> {
    const manager = queryRunner
      ? queryRunner.manager
      : this.bookRepository.manager;
    const existBook: Book = await this.bookRepository.findOneBy({
      code: createBookDto.code,
    });
    if (existBook) {
      throw new NotFoundException(
        'Book already exists, you can change stok book',
      );
    }
    const book: Book = this.bookRepository.create(createBookDto);
    return manager.save(book);
    // return await this.bookRepository.save(book);
  }

  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find();
  }

  async findOneByCode(code: string): Promise<Book> {
    const book: Book = await this.bookRepository.findOneBy({
      code: code,
    });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async update(
    code: string,
    updateBookDto: UpdateBookDto,
    queryRunner?: QueryRunner,
  ): Promise<Book> {
    const manager = queryRunner
      ? queryRunner.manager
      : this.bookRepository.manager;
    const book: Book = await this.findOneByCode(code);
    Object.assign(book, updateBookDto);
    return manager.save(book);
    // return this.bookRepository.save(book);
  }

  async remove(code: string): Promise<object> {
    const book: Book = await this.findOneByCode(code);
    await this.bookRepository.remove(book);
    return { message: 'Book has been deleted' };
  }
}
