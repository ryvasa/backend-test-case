import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { MoreThan, QueryRunner, Repository } from 'typeorm';
import { CreateBookDto, UpdateBookDto } from './dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
  ) {}
  async addBook(
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
      throw new BadRequestException(
        'Book already exists, you can change stok book',
      );
    }
    const book: Book = this.bookRepository.create(createBookDto);
    return manager.save(book);
  }

  async findAllBook(): Promise<Book[]> {
    return await this.bookRepository.find({
      where: {
        stock: MoreThan(0),
      },
    });
  }

  async findOneBook(code: string): Promise<Book> {
    const book: Book = await this.bookRepository.findOneBy({
      code: code,
    });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async updateBook(
    code: string,
    updateBookDto: UpdateBookDto,
    queryRunner?: QueryRunner,
  ): Promise<Book> {
    const manager = queryRunner
      ? queryRunner.manager
      : this.bookRepository.manager;
    const book: Book = await this.findOneBook(code);
    Object.assign(book, updateBookDto);
    return manager.save(book);
  }

  async deleteBook(code: string): Promise<object> {
    await this.findOneBook(code);
    await this.bookRepository.delete(code);
    return { message: 'Book is deleted successfully.' };
  }
}
