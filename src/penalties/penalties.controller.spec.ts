import { Test, TestingModule } from '@nestjs/testing';
import { PenaltiesController } from './penalties.controller';
import { PenaltiesService } from './penalties.service';
import { Penalty } from './entities/penalty.entity';
import { CreatePenaltyDto } from './dto';
import { Member } from 'src/members/entities/member.entity';
import { BookLoan } from 'src/book-loans/entities/book-loan.entity';
import { Book } from 'src/books/entities/book.entity';
import { BadRequestException } from '@nestjs/common';

describe('PenaltiesController', () => {
  let controller: PenaltiesController;
  let penaltiesService: PenaltiesService;

  const mockPenaltiesService = {
    createPenalty: jest.fn(),
    findAllPenalty: jest.fn(),
    findPenaltiesByMember: jest.fn(),
    checkPenaltyMember: jest.fn(),
    checkExsistPenaltyByBookLoan: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PenaltiesController],
      providers: [
        { provide: PenaltiesService, useValue: mockPenaltiesService },
      ],
    }).compile();

    controller = module.get<PenaltiesController>(PenaltiesController);
    penaltiesService = module.get<PenaltiesService>(PenaltiesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('penaltiesService should be defined', () => {
    expect(penaltiesService).toBeDefined();
  });

  describe('createPenalty', () => {
    it('should return penalty', async () => {
      const createPenaltyDto: CreatePenaltyDto = {
        member_code: 'M001',
        book_loan_code: 'L001',
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

      const mockPenalty: Penalty = {
        code: 'P001',
        member: mockMember,
        book_loan: mockBookLoan,
        penalty_start_date: new Date(),
        penalty_end_date: new Date(),
        setPenaltyEndDate: () => {},
      };

      mockPenaltiesService.createPenalty.mockResolvedValue(mockPenalty);

      const penalty: Penalty = await controller.createPenalty(createPenaltyDto);

      expect(penalty).toBeDefined();
      expect(penalty).toEqual(mockPenalty);
      expect(mockPenaltiesService.createPenalty).toHaveBeenCalledWith(
        createPenaltyDto,
      );
    });
    it('should throw BadRequestException if member not found', async () => {
      const createPenaltyDto: CreatePenaltyDto = {
        member_code: 'M001',
        book_loan_code: 'L001',
      };
      mockPenaltiesService.createPenalty.mockRejectedValue(
        new BadRequestException('Member not found'),
      );

      expect(mockPenaltiesService.createPenalty).toHaveBeenCalledWith(
        createPenaltyDto,
      );
      await expect(controller.createPenalty(createPenaltyDto)).rejects.toThrow(
        BadRequestException,
      );
    });
    it('should throw BadRequestException if book loan not found', async () => {
      const createPenaltyDto: CreatePenaltyDto = {
        member_code: 'M001',
        book_loan_code: 'L001',
      };

      mockPenaltiesService.createPenalty.mockRejectedValue(
        new BadRequestException('Member not found'),
      );
      expect(mockPenaltiesService.createPenalty).toHaveBeenCalledWith(
        createPenaltyDto,
      );
      await expect(controller.createPenalty(createPenaltyDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAllPenalty', () => {
    it('should return penalty', async () => {
      const mockPenalties: Penalty[] = [
        {
          code: 'P001',
          member: {
            code: 'M001',
            name: 'John Doe',
            created_date: new Date(),
            updated_date: new Date(),
            penalties: [],
            book_loans: [],
          },
          book_loan: {
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
          penalty_start_date: new Date(),
          penalty_end_date: new Date(),
          setPenaltyEndDate: () => {},
        },
      ];

      mockPenaltiesService.findAllPenalty.mockResolvedValue(mockPenalties);

      const penalty: Penalty[] = await controller.findAllPenalty();

      expect(penalty).toBeDefined();
      expect(penalty).toEqual(mockPenalties);
      expect(mockPenaltiesService.findAllPenalty).toHaveBeenCalled();
    });
  });

  describe('findPenaltiesByMember', () => {
    it('should return penalty', async () => {
      const mockPenalties: Penalty[] = [
        {
          code: 'P001',
          member: {
            code: 'M001',
            name: 'John Doe',
            created_date: new Date(),
            updated_date: new Date(),
            penalties: [],
            book_loans: [],
          },
          book_loan: {
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
          penalty_start_date: new Date(),
          penalty_end_date: new Date(),
          setPenaltyEndDate: () => {},
        },
      ];

      mockPenaltiesService.findPenaltiesByMember.mockResolvedValue(
        mockPenalties,
      );

      const penalty: Penalty[] = await controller.findPenaltiesByMember('M001');

      expect(penalty).toBeDefined();
      expect(penalty).toEqual(mockPenalties);
      expect(mockPenaltiesService.findPenaltiesByMember).toHaveBeenCalledWith(
        'M001',
      );
    });
  });
});
