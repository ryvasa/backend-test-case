import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookLoanDto } from './dto/create-book-loan.dto';
import { BookLoan } from './entities/book-loan.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BooksService } from 'src/books/books.service';
import { MembersService } from 'src/members/members.service';
import { DataSource, IsNull, QueryRunner, Repository } from 'typeorm';
import { Book } from 'src/books/entities/book.entity';
import { Member } from 'src/members/entities/member.entity';
import { PenaltiesService } from 'src/penalties/penalties.service';
// import { Penalty } from 'src/penalties/entities/penalty.entity';

@Injectable()
export class BookLoansService {
  constructor(
    @InjectRepository(BookLoan)
    private bookLoanRepository: Repository<BookLoan>,
    // @InjectRepository(Penalty)
    // private penaltyRepository: Repository<Penalty>,
    // @InjectRepository(Book)
    // private bookRepository: Repository<Book>,
    @Inject(forwardRef(() => PenaltiesService))
    private readonly penaltiesService: PenaltiesService,
    private readonly booksService: BooksService,
    private readonly membersService: MembersService,
    private readonly dataSource: DataSource,
  ) {}

  async borrowBook(createBookLoanDto: CreateBookLoanDto): Promise<BookLoan> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const book: Book = await this.booksService.findOneByCode(
        createBookLoanDto.book_code,
      );
      if (book.stock <= 0) {
        throw new BadRequestException('Stock buku tidak tersedia');
      }

      const member: Member = await this.membersService.findOne(
        createBookLoanDto.member_code,
      );

      // TODO: tambahkan check member/penalty yang meminjam buku

      await this.countActiveLoanedBooks(createBookLoanDto.member_code);

      const bookLoan: BookLoan = queryRunner.manager.create(BookLoan, {
        member,
        book,
      });

      if (bookLoan) {
        await this.booksService.update(
          book.code,
          {
            stock: book.stock - 1,
          },
          queryRunner,
        );
      }

      const count: number = await queryRunner.manager.count(BookLoan);

      bookLoan.code = `L${(count + 1).toString().padStart(3, '0')}`;

      await queryRunner.manager.save(BookLoan, bookLoan);

      await queryRunner.commitTransaction();
      return bookLoan;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new Error(err);
    } finally {
      await queryRunner.release();
    }
  }

  async returnBook(code: string): Promise<BookLoan> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.findOne(code);

      const bookLoan: BookLoan = await queryRunner.manager
        .createQueryBuilder(BookLoan, 'book_loans')
        .leftJoinAndSelect('book_loans.member', 'member')
        .leftJoinAndSelect('book_loans.book', 'book')
        .where('book_loans.code = :code', { code })
        .getOne();

      if (bookLoan.return_date) {
        throw new BadRequestException('Buku ini telah di kembalikan');
      }

      // tanggal di ubah tapi tidak di save?
      bookLoan.return_date = new Date();

      // update book stock
      if (bookLoan.return_date) {
        const book: Book = await this.booksService.findOneByCode(
          bookLoan.book.code,
        );
        await this.booksService.update(
          book.code,
          {
            stock: book.stock + 1,
          },
          queryRunner,
        );
      }

      // creae penalty if it exceeds the expected return date
      if (bookLoan.return_date > bookLoan.expected_return_date) {
        await this.penaltiesService.createPenalty(
          {
            member_code: bookLoan.member.code,
            book_loan_code: bookLoan.code,
          },
          queryRunner,
        );
      }

      await queryRunner.manager.save(BookLoan, bookLoan);

      await queryRunner.commitTransaction();
      return bookLoan;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new Error(err);
    } finally {
      await queryRunner.release();
    }
  }

  async countActiveLoanedBooks(member_code: string): Promise<number> {
    const bookLoans: number = await this.bookLoanRepository.count({
      where: {
        member: { code: member_code },
        return_date: IsNull(),
      },
    });

    if (bookLoans >= 2) {
      throw new BadRequestException('Tidak bisa meminjam lebih dari 2 buku');
    }

    return bookLoans;
  }

  async findOne(code: string): Promise<BookLoan> {
    const bookLoan: BookLoan = await this.bookLoanRepository.findOneBy({
      code,
    });
    if (!bookLoan) {
      throw new NotFoundException('Book loan record not found');
    }
    return bookLoan;
  }

  // async returnBook(code: string): Promise<BookLoan> {
  //   await this.findOne(code);

  //   const bookLoan: BookLoan = await this.bookLoanRepository
  //     .createQueryBuilder('book_loans')
  //     .leftJoinAndSelect('book_loans.member', 'member')
  //     .leftJoinAndSelect('book_loans.book', 'book')
  //     .where('book_loans.code = :code', { code })
  //     .getOne();

  //   if (bookLoan.return_date) {
  //     throw new BadRequestException('Buku ini telah di kembalikan');
  //   }

  //   // set return book with the current time
  //   bookLoan.return_date = new Date();

  //   await this.penaltiesService.createPenalty({
  //     member_code: bookLoan.member.code,
  //     book_loan_code: bookLoan.code,
  //   });

  //   if (bookLoan.return_date !== null) {
  //     const book = await this.booksService.findOneByCode(bookLoan.book.code);
  //     // increase book stocks
  //     await this.booksService.update(book.code, {
  //       stock: book.stock + 1,
  //     });
  //   }

  //   return this.bookLoanRepository.save(bookLoan);
  // }

  findAllBookLoan(): Promise<BookLoan[]> {
    return this.bookLoanRepository.find();
  }

  // remove(id: number) {
  //   return `This action removes a #${id} bookLoan`;
  // }
}
