import { Test, TestingModule } from '@nestjs/testing';
import { BookLoansService } from './book-loans.service';
import { DataSource, Repository } from 'typeorm';
import { BookLoan } from './entities/book-loan.entity';
import { BooksService } from 'src/books/books.service';
import { MembersService } from 'src/members/members.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PenaltiesService } from 'src/penalties/penalties.service';
import { CreateBookLoanDto } from './dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BookLoansService', () => {
  let service: BookLoansService;
  let booksService: BooksService;
  let membersService: MembersService;
  let penaltiesService: PenaltiesService;
  let bookLoansRepository: Repository<BookLoan>;
  let dataSource: DataSource;

  const BOOK_LOANS_REPOSITORY_TOKEN = getRepositoryToken(BookLoan);

  const mockBookLoansRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
    manager: {
      save: jest.fn(),
    },
  };
  const mockBooksService = {
    findOneBook: jest.fn(),
    updateBook: jest.fn(),
  };
  const mockMembersService = {
    findOneMember: jest.fn(),
  };
  const mockPenaltiesService = {
    createPenalty: jest.fn(),
    checkPenaltyMember: jest.fn(),
  };

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        create: jest.fn(),
        save: jest.fn(),
        count: jest.fn(),
        createQueryBuilder: jest.fn().mockReturnValue({
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          getOne: jest.fn(),
        }),
      },
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookLoansService,
        {
          provide: BOOK_LOANS_REPOSITORY_TOKEN,
          useValue: mockBookLoansRepository,
        },
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
        {
          provide: MembersService,
          useValue: mockMembersService,
        },
        {
          provide: PenaltiesService,
          useValue: mockPenaltiesService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<BookLoansService>(BookLoansService);
    bookLoansRepository = module.get<Repository<BookLoan>>(
      BOOK_LOANS_REPOSITORY_TOKEN,
    );
    booksService = module.get<BooksService>(BooksService);
    membersService = module.get<MembersService>(MembersService);
    penaltiesService = module.get<PenaltiesService>(PenaltiesService);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('bookLoanRepository should be defined', () => {
    expect(bookLoansRepository).toBeDefined();
  });

  it('dataSource should be defined', () => {
    expect(dataSource).toBeDefined();
  });

  it('penaltiesService should be defined', () => {
    expect(penaltiesService).toBeDefined();
  });

  it('booksService should be defined', () => {
    expect(booksService).toBeDefined();
  });
  it('membersService should be defined', () => {
    expect(membersService).toBeDefined();
  });
  it('BooksService should be defined', () => {
    expect(BooksService).toBeDefined();
  });

  describe('borrowBook', () => {
    const createBookLoanDto: CreateBookLoanDto = {
      member_code: 'M001',
      book_code: 'B001',
    };
    const mockBook = {
      code: 'B001',
      stock: 1,
      title: 'Book title',
      author: 'Author',
    };
    const mockMember = {
      code: 'M001',
      name: 'John Doe',
    };
    const mockBookLoan = {
      code: 'L001',
      expected_return_date: new Date('2024-09-10'),
      return_date: null,
      borrowing_date: new Date('2024-09-1'),
      member: mockMember,
      book: mockBook,
    };

    beforeEach(async () => {
      const queryRunner = mockDataSource.createQueryRunner();
      queryRunner.manager.create.mockReturnValue(mockBookLoan);
      queryRunner.manager.count.mockResolvedValue(0);
      queryRunner.manager.save.mockResolvedValue(mockBookLoan);

      mockBooksService.findOneBook.mockResolvedValue(mockBook);
      mockMembersService.findOneMember.mockResolvedValue(mockMember);
      mockPenaltiesService.checkPenaltyMember.mockResolvedValue(undefined);
      mockBookLoansRepository.count.mockResolvedValue(0);
    });
    it('should successfully borrow a book', async () => {
      const expectedBookLoan = {
        code: 'L001',
        member: mockMember,
        book: mockBook,
        expected_return_date: new Date('2024-09-10'),
        return_date: null,
        borrowing_date: new Date('2024-09-1'),
      };

      const queryRunner = mockDataSource.createQueryRunner();
      queryRunner.manager.save.mockResolvedValue(expectedBookLoan);

      const result = await service.borrowBook(createBookLoanDto);

      expect(result).toEqual(expectedBookLoan);
      expect(mockBooksService.updateBook).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('should throw BadRequestException if book stock is 0', async () => {
      mockBooksService.findOneBook.mockResolvedValue({ ...mockBook, stock: 0 });
      await expect(service.borrowBook(createBookLoanDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error if member has active penalties', async () => {
      mockPenaltiesService.checkPenaltyMember.mockRejectedValue(
        new BadRequestException('Active penalty'),
      );
      await expect(service.borrowBook(createBookLoanDto)).rejects.toThrow(
        'Active penalty',
      );
    });
  });

  describe('returnBook', () => {
    const mockBook = {
      code: 'B001',
      stock: 1,
      title: 'Book title',
      author: 'Author',
    };
    const mockMember = {
      code: 'M001',
      name: 'John Doe',
    };
    const mockBookLoan = {
      code: 'L001',
      expected_return_date: new Date('2024-09-10'),
      return_date: null,
      borrowing_date: new Date('2024-09-1'),
      member: mockMember,
      book: mockBook,
    };

    beforeEach(async () => {
      const queryRunner = mockDataSource.createQueryRunner();
      queryRunner.manager
        .createQueryBuilder()
        .getOne.mockResolvedValue(mockBookLoan);
      mockBookLoansRepository.findOneBy.mockResolvedValue(mockBookLoan);

      mockBooksService.findOneBook.mockResolvedValue(mockBook);
      mockMembersService.findOneMember.mockResolvedValue(mockMember);
      mockPenaltiesService.checkPenaltyMember.mockResolvedValue(undefined);
      mockBookLoansRepository.count.mockResolvedValue(0);
    });

    it('should successfully return a book', async () => {
      const queryRunner = mockDataSource.createQueryRunner();
      queryRunner.manager.createQueryBuilder().getOne.mockResolvedValue({
        ...mockBookLoan,
        return_date: null,
        expected_return_date: new Date('2024-09-01'),
      });

      const result = await service.returnBook('L001');
      expect(result.return_date).toBeDefined();
      expect(mockBooksService.updateBook).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('should throw BadRequestException if book is already returned', async () => {
      const queryRunner = mockDataSource.createQueryRunner();

      queryRunner.manager
        .createQueryBuilder()
        .getOne.mockResolvedValue({ ...mockBookLoan, return_date: new Date() });
      await expect(service.returnBook('L001')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create a penalty if book is returned late', async () => {
      await service.returnBook('L001');
      expect(mockPenaltiesService.createPenalty).toHaveBeenCalled();
    });
  });

  describe('countActiveLoanedBooks', () => {
    it('should return the number of active loaned books', async () => {
      mockBookLoansRepository.count.mockResolvedValue(1);
      const result = await service.countActiveLoanedBooks('M001');
      expect(result).toBe(1);
      expect(mockBookLoansRepository.count).toHaveBeenCalled();
    });

    it('should throw BadRequestException if member has 2 or more active loans', async () => {
      mockBookLoansRepository.count.mockResolvedValue(2);
      await expect(service.countActiveLoanedBooks('M001')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOneBookLoan', () => {
    it('should return the number of active loaned books', async () => {
      const mockBook = {
        code: 'B001',
        stock: 1,
        title: 'Book title',
        author: 'Author',
      };
      const mockMember = {
        code: 'M001',
        name: 'John Doe',
      };
      const mockBookLoan = {
        code: 'L001',
        expected_return_date: new Date('2024-09-10'),
        return_date: null,
        borrowing_date: new Date('2024-09-1'),
        member: mockMember,
        book: mockBook,
      };

      mockBookLoansRepository.findOneBy.mockResolvedValue(mockBookLoan);
      const result = await service.findOneBookLoan('L001');
      expect(result).toBe(mockBookLoan);
      expect(mockBookLoansRepository.findOneBy).toHaveBeenCalled();
    });
    it('should throw NotFoundException if book loan is not found', async () => {
      mockBookLoansRepository.findOneBy.mockResolvedValue(undefined);
      await expect(service.findOneBookLoan('L001')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAllBookLoan', () => {
    it('should return all book loans', async () => {
      const mockBook = {
        code: 'B001',
        stock: 1,
        title: 'Book title',
        author: 'Author',
      };
      const mockMember = {
        code: 'M001',
        name: 'John Doe',
      };
      const mockBookLoan = {
        code: 'L001',
        expected_return_date: new Date('2024-09-10'),
        return_date: null,
        borrowing_date: new Date('2024-09-1'),
        member: mockMember,
        book: mockBook,
      };

      mockBookLoansRepository.find.mockResolvedValue([mockBookLoan]);
      const result = await service.findAllBookLoan();
      expect(result).toStrictEqual([mockBookLoan]);
      expect(mockBookLoansRepository.find).toHaveBeenCalled();
    });
  });
});
