import { Test, TestingModule } from '@nestjs/testing';
import { BookLoansController } from './book-loans.controller';
import { BookLoansService } from './book-loans.service';
import { BookLoan } from './entities/book-loan.entity';
import { BadRequestException } from '@nestjs/common';
import { CreateBookLoanDto } from './dto';
import { Book } from 'src/books/entities/book.entity';
import { Member } from 'src/members/entities/member.entity';

describe('BookLoansController', () => {
  let controller: BookLoansController;
  let bookLoansService: BookLoansService;

  const mockBookLoansService = {
    borrowBook: jest.fn(),
    returnBook: jest.fn(),
    findOneBookLoan: jest.fn(),
    findAllBookLoan: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookLoansController],
      providers: [
        { provide: BookLoansService, useValue: mockBookLoansService },
      ],
    }).compile();

    controller = module.get<BookLoansController>(BookLoansController);
    bookLoansService = module.get<BookLoansService>(BookLoansService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('bookLoansService should be defined', () => {
    expect(bookLoansService).toBeDefined();
  });

  describe('createBookLoan', () => {
    it('should create book loan', async () => {
      const createBookLoanDto: CreateBookLoanDto = {
        member_code: 'M001',
        book_code: 'B001',
      };
      const mockMember: Member = {
        code: 'M001',
        name: 'John Doe',
        created_date: new Date(),
        updated_date: new Date(),
        penalties: [],
        book_loans: [],
      };
      const mockBook: Book = {
        code: 'B001',
        title: 'Book 1',
        author: 'Author 1',
        stock: 5,
        created_date: new Date(),
        updated_date: new Date(),
        book_loans: [],
      };

      const mockBookLoan: BookLoan = {
        code: 'L001',
        member: mockMember,
        book: mockBook,
        return_date: new Date(),
        expected_return_date: new Date(),
        borrowing_date: new Date(),
        setExpectedReturnDate: () => {},
      };

      mockBookLoansService.borrowBook.mockResolvedValue(mockBookLoan);

      const bookLoan: BookLoan =
        await controller.createBookLoan(createBookLoanDto);

      expect(bookLoan).toBeDefined();
      expect(bookLoan).toEqual(mockBookLoan);
      expect(mockBookLoansService.borrowBook).toHaveBeenCalledWith(
        createBookLoanDto,
      );
    });
    it('should throw BadRequestException if member not found', async () => {
      const createBookLoanDto: CreateBookLoanDto = {
        member_code: 'M001',
        book_code: 'B001',
      };
      mockBookLoansService.borrowBook.mockRejectedValue(
        new BadRequestException('Member not found'),
      );

      expect(mockBookLoansService.borrowBook).toHaveBeenCalledWith(
        createBookLoanDto,
      );
      await expect(
        controller.createBookLoan(createBookLoanDto),
      ).rejects.toThrow(BadRequestException);
    });
    it('should throw BadRequestException if book not found', async () => {
      const createBookLoanDto: CreateBookLoanDto = {
        member_code: 'M001',
        book_code: 'B001',
      };

      mockBookLoansService.borrowBook.mockRejectedValue(
        new BadRequestException('Book not found'),
      );
      expect(mockBookLoansService.borrowBook).toHaveBeenCalledWith(
        createBookLoanDto,
      );
      await expect(
        controller.createBookLoan(createBookLoanDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateBookLoan', () => {
    it('should update book loan', async () => {
      const mockMember: Member = {
        code: 'M001',
        name: 'John Doe',
        created_date: new Date(),
        updated_date: new Date(),
        penalties: [],
        book_loans: [],
      };
      const mockBook: Book = {
        code: 'B001',
        title: 'Book 1',
        author: 'Author 1',
        stock: 5,
        created_date: new Date(),
        updated_date: new Date(),
        book_loans: [],
      };

      const mockBookLoan: BookLoan = {
        code: 'L001',
        member: mockMember,
        book: mockBook,
        return_date: new Date(),
        expected_return_date: new Date(),
        borrowing_date: new Date(),
        setExpectedReturnDate: () => {},
      };

      mockBookLoansService.returnBook.mockResolvedValue(mockBookLoan);
      const bookLoan: BookLoan = await controller.updateBookLoan('L001');

      expect(bookLoan).toBeDefined();
      expect(bookLoan).toEqual(mockBookLoan);
      expect(mockBookLoansService.borrowBook).toHaveBeenCalled();
    });
    it('should throw BadRequestException if book loan not found', async () => {
      mockBookLoansService.returnBook.mockRejectedValue(
        new BadRequestException('Book loan not found'),
      );

      expect(mockBookLoansService.returnBook).toHaveBeenCalledWith('L001');
      await expect(controller.updateBookLoan('L001')).rejects.toThrow(
        BadRequestException,
      );
    });
    it('should throw BadRequestException if book alredy returned', async () => {
      mockBookLoansService.returnBook.mockRejectedValue(
        new BadRequestException(
          `This book was returned on date ${new Date()}.`,
        ),
      );
      expect(mockBookLoansService.returnBook).toHaveBeenCalledWith('L001');
      await expect(controller.updateBookLoan('L001')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAllBookLoan', () => {
    it('should return book loan', async () => {
      const mockBookLoans: BookLoan[] = [
        {
          code: 'L001',
          member: {
            code: 'M001',
            name: 'John Doe',
            created_date: new Date(),
            updated_date: new Date(),
            penalties: [],
            book_loans: [],
          },
          book: {
            code: 'B001',
            title: 'Book 1',
            author: 'Author 1',
            stock: 5,
            created_date: new Date(),
            updated_date: new Date(),
            book_loans: [],
          },
          return_date: new Date(),
          expected_return_date: new Date(),
          borrowing_date: new Date(),
          setExpectedReturnDate: () => {},
        },
      ];

      mockBookLoansService.findAllBookLoan.mockResolvedValue(mockBookLoans);

      const bookLoan: BookLoan[] = await controller.findAllBookLoan();

      expect(bookLoan).toBeDefined();
      expect(bookLoan).toEqual(mockBookLoans);
      expect(mockBookLoansService.findAllBookLoan).toHaveBeenCalled();
    });
  });
});
