import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CreateBookDto, UpdateBookDto } from './dto';
import { Book } from './entities/book.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BooksController', () => {
  let controller: BooksController;
  let booksService: BooksService;

  const mockBooksService = {
    addBook: jest.fn(),
    findAllBook: jest.fn(),
    findOneBook: jest.fn(),
    updateBook: jest.fn(),
    deleteBook: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    booksService = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('booksService should be defined', () => {
    expect(booksService).toBeDefined();
  });

  describe('createBook', () => {
    it('should create a new book', async () => {
      const createBookDto: CreateBookDto = {
        code: 'B001',
        title: 'Test Book',
        author: 'Test Author',
        stock: 10,
      };
      const expectedResult: Book = {
        ...createBookDto,
        created_date: new Date(),
        updated_date: new Date(),
        book_loans: [],
      };

      mockBooksService.addBook.mockResolvedValue(expectedResult);

      const result = await controller.createBook(createBookDto);
      expect(result).toEqual(expectedResult);
      expect(mockBooksService.addBook).toHaveBeenCalledWith(createBookDto);
    });

    it('should throw BadRequestException if book code already exists', async () => {
      const createBookDto: CreateBookDto = {
        code: 'B001',
        title: 'Test Book',
        author: 'Test Author',
        stock: 10,
      };

      mockBooksService.addBook.mockRejectedValue(
        new BadRequestException(
          'Book already exists, you can change stok book',
        ),
      );

      await expect(controller.createBook(createBookDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAllBooks', () => {
    it('should return an array of books', async () => {
      const expectedResult: Book[] = [
        {
          code: 'B001',
          title: 'Book 1',
          author: 'Author 1',
          stock: 5,
          created_date: new Date(),
          updated_date: new Date(),
          book_loans: [],
        },
        {
          code: 'B002',
          title: 'Book 2',
          author: 'Author 2',
          stock: 3,
          created_date: new Date(),
          updated_date: new Date(),
          book_loans: [],
        },
      ];

      mockBooksService.findAllBook.mockResolvedValue(expectedResult);

      const result = await controller.findAllBooks();

      expect(result).toEqual(expectedResult);
      expect(mockBooksService.findAllBook).toHaveBeenCalled();
    });
  });

  describe('findOneBook', () => {
    it('should return a single book', async () => {
      const bookCode = 'B001';
      const expectedResult: Book = {
        code: bookCode,
        title: 'Book 1',
        author: 'Author 1',
        stock: 5,
        created_date: new Date(),
        updated_date: new Date(),
        book_loans: [],
      };

      mockBooksService.findOneBook.mockResolvedValue(expectedResult);

      const result = await controller.findOneBook(bookCode);

      expect(result).toEqual(expectedResult);
      expect(mockBooksService.findOneBook).toHaveBeenCalledWith(bookCode);
    });

    it('should throw NotFoundException if book is not found', async () => {
      const bookCode = 'B001';

      mockBooksService.findOneBook.mockRejectedValue(
        new NotFoundException('Book not found'),
      );

      await expect(controller.findOneBook(bookCode)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateBook', () => {
    it('should update a book', async () => {
      const bookCode = 'B001';
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
        stock: 15,
      };
      const expectedResult: Book = {
        code: bookCode,
        title: 'Updated Book',
        author: 'Author 1',
        stock: 15,
        created_date: new Date(),
        updated_date: new Date(),
        book_loans: [],
      };

      mockBooksService.updateBook.mockResolvedValue(expectedResult);

      const result = await controller.updateBook(bookCode, updateBookDto);

      expect(result).toEqual(expectedResult);
      expect(mockBooksService.updateBook).toHaveBeenCalledWith(
        bookCode,
        updateBookDto,
      );
    });

    it('should throw NotFoundException if book is not found', async () => {
      const bookCode = 'B001';
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
        stock: 15,
      };

      mockBooksService.updateBook.mockRejectedValue(
        new NotFoundException('Book not found'),
      );

      await expect(
        controller.updateBook(bookCode, updateBookDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeBook', () => {
    it('should remove a book', async () => {
      const bookCode = 'B001';
      const expectedResult = { message: 'Book is deleted successfully.' };

      mockBooksService.deleteBook.mockResolvedValue(expectedResult);

      const result = await controller.deleteBook(bookCode);

      expect(result).toEqual(expectedResult);
      expect(mockBooksService.deleteBook).toHaveBeenCalledWith(bookCode);
    });

    it('should throw NotFoundException if book is not found', async () => {
      const bookCode = 'B001';

      mockBooksService.deleteBook.mockRejectedValue(
        new NotFoundException('Book not found'),
      );

      await expect(controller.deleteBook(bookCode)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
