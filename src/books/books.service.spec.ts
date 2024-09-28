import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BookService', () => {
  let service: BooksService;
  let booksRepository: Repository<Book>;

  const BOOK_REPOSITORY_TOKEN = getRepositoryToken(Book);

  const mockBooksRepository = {
    create: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    manager: {
      save: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: BOOK_REPOSITORY_TOKEN,
          useValue: mockBooksRepository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    booksRepository = module.get<Repository<Book>>(BOOK_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('booksRepository should be defined', () => {
    expect(booksRepository).toBeDefined();
  });

  describe('addBook', () => {
    const createBookDto = {
      code: 'B001',
      stock: 1,
      title: 'Book title',
      author: 'Author',
    };
    const mockBook = {
      code: 'B001',
      stock: 1,
      title: 'Book title',
      author: 'Author',
      created_date: new Date('2024-09-1'),
      updated_date: new Date('2024-09-1'),
    };

    it('should successfully add a book', async () => {
      mockBooksRepository.manager.save.mockResolvedValue(mockBook);
      const result = await service.addBook(createBookDto);
      expect(result).toEqual(mockBook);
      expect(mockBooksRepository.findOneBy).toHaveBeenCalledWith({
        code: createBookDto.code,
      });
      expect(mockBooksRepository.create).toHaveBeenCalledWith(createBookDto);
      expect(mockBooksRepository.manager.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if book already exists', async () => {
      mockBooksRepository.findOneBy.mockResolvedValue(mockBook);
      expect(mockBooksRepository.findOneBy).toHaveBeenCalledWith({
        code: createBookDto.code,
      });
      await expect(service.addBook(createBookDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAllBook', () => {
    const mockBook = {
      code: 'B001',
      stock: 1,
      title: 'Book title',
      author: 'Author',
      created_date: new Date('2024-09-1'),
      updated_date: new Date('2024-09-1'),
    };
    it('should return all books', async () => {
      const mockBooks = [mockBook];
      mockBooksRepository.find.mockResolvedValue(mockBooks);
      const result = await service.findAllBook();
      expect(result).toStrictEqual(mockBooks);
      expect(mockBooksRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOneBook', () => {
    it('should return the book with the given code', async () => {
      const mockBook = {
        code: 'B001',
        stock: 1,
        title: 'Book title',
        author: 'Author',
        created_date: new Date('2024-09-1'),
        updated_date: new Date('2024-09-1'),
      };
      mockBooksRepository.findOneBy.mockResolvedValue(mockBook);
      const result = await service.findOneBook('B001');
      expect(result).toStrictEqual(mockBook);
      expect(mockBooksRepository.findOneBy).toHaveBeenCalledWith({
        code: 'B001',
      });
    });
    it('should throw NotFoundException if book is not found', async () => {
      mockBooksRepository.findOneBy.mockResolvedValue(undefined);
      expect(mockBooksRepository.findOneBy).toHaveBeenCalledWith({
        code: 'B001',
      });
      await expect(service.findOneBook('B001')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateBook', () => {
    const updateBookDto = {
      code: 'B001',
      stock: 2,
      title: 'Updated book title',
      author: 'Updated author',
    };
    function createMockBook(overrides = {}) {
      return {
        code: 'B001',
        stock: 1,
        title: 'Book title',
        author: 'Author',
        created_date: new Date('2024-09-1'),
        updated_date: new Date('2024-09-1'),
        book_loans: [],
        ...overrides,
      };
    }
    const mockBook = createMockBook();
    it('should update the book with the given code', async () => {
      jest.spyOn(service, 'findOneBook').mockResolvedValue(mockBook);
      mockBooksRepository.manager.save.mockResolvedValue({
        ...mockBook,
        ...updateBookDto,
      });
      const result = await service.updateBook('B001', updateBookDto);

      expect(result).toEqual({ ...mockBook, ...updateBookDto });
      expect(service.findOneBook).toHaveBeenCalledWith('B001');
      expect(mockBooksRepository.manager.save).toHaveBeenCalled();
    });
    it('should throw NotFoundException if book is not found', async () => {
      jest
        .spyOn(service, 'findOneBook')
        .mockRejectedValue(new NotFoundException('Book not found'));
      expect(mockBooksRepository.findOneBy).toHaveBeenCalledWith({
        code: 'B001',
      });
      await expect(service.updateBook('B001', updateBookDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteBook', () => {
    function createMockBook(overrides = {}) {
      return {
        code: 'B001',
        stock: 1,
        title: 'Book title',
        author: 'Author',
        created_date: new Date('2024-09-1'),
        updated_date: new Date('2024-09-1'),
        book_loans: [],
        ...overrides,
      };
    }
    const mockBook = createMockBook();
    it('should delete the book with the given code', async () => {
      jest.spyOn(service, 'findOneBook').mockResolvedValue(mockBook);
      mockBooksRepository.delete.mockResolvedValue(mockBook);

      const result = await service.deleteBook('B001');

      expect(result).toEqual({ message: 'Book is deleted successfully.' });
      expect(service.findOneBook).toHaveBeenCalledWith('B001');
      expect(mockBooksRepository.manager.save).toHaveBeenCalled();
    });
    it('should throw NotFoundException if book is not found', async () => {
      jest
        .spyOn(service, 'findOneBook')
        .mockRejectedValue(new NotFoundException('Book not found'));

      expect(mockBooksRepository.findOneBy).toHaveBeenCalledWith({
        code: 'B001',
      });
      await expect(service.deleteBook('B001')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
