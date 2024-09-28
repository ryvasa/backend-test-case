import { Test, TestingModule } from '@nestjs/testing';
import { PenaltiesService } from './penalties.service';
import { MembersService } from 'src/members/members.service';
import { BookLoansService } from 'src/book-loans/book-loans.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Penalty } from './entities/penalty.entity';
import { Repository } from 'typeorm';
import { CreatePenaltyDto } from './dto';
import { BadRequestException } from '@nestjs/common';

describe('PenaltiesService', () => {
  let service: PenaltiesService;
  let bookLoansService: BookLoansService;
  let membersService: MembersService;
  let penaltyRepository: Repository<Penalty>;
  const PENALTY_REPOSITORY_TOKEN = getRepositoryToken(Penalty);

  const mockPenaltyRepository = {
    create: jest.fn(),
    save: jest.fn(),
    count: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
    manager: {
      save: jest.fn(),
    },
  };
  const mockMembersService = {
    findOneMember: jest.fn(),
  };
  const mockBookLoansService = {
    findOneBookLoan: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PenaltiesService,
        {
          provide: PENALTY_REPOSITORY_TOKEN,
          useValue: mockPenaltyRepository,
        },
        {
          provide: MembersService,
          useValue: mockMembersService,
        },
        {
          provide: BookLoansService,
          useValue: mockBookLoansService,
        },
      ],
    }).compile();

    service = module.get<PenaltiesService>(PenaltiesService);
    penaltyRepository = module.get<Repository<Penalty>>(
      PENALTY_REPOSITORY_TOKEN,
    );
    bookLoansService = module.get<BookLoansService>(BookLoansService);
    membersService = module.get<MembersService>(MembersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('penaltyRepository should be defined', () => {
    expect(penaltyRepository).toBeDefined();
  });

  it('bookLoansService should be defined', () => {
    expect(bookLoansService).toBeDefined();
  });

  it('membersService should be defined', () => {
    expect(membersService).toBeDefined();
  });

  describe('createPenalty', () => {
    const createPenaltyDto: CreatePenaltyDto = {
      member_code: 'M001',
      book_loan_code: 'L001',
    };
    const mockMember = { code: 'M001', name: 'John Doe' };
    const mockBookLoan = { code: 'L001' };
    const mockPenalty = {
      code: 'P001',
      member: mockMember,
      book_loan: mockBookLoan,
    };

    beforeEach(() => {
      jest.spyOn(service, 'checkExsistPenaltyByBookLoan').mockResolvedValue();
      mockMembersService.findOneMember.mockResolvedValue(mockMember);
      mockBookLoansService.findOneBookLoan.mockResolvedValue(mockBookLoan);
      mockPenaltyRepository.count.mockResolvedValue(0);
      mockPenaltyRepository.create.mockReturnValue(mockPenalty);
      mockPenaltyRepository.manager.save.mockResolvedValue(mockPenalty);
    });

    it('should create a penalty successfully', async () => {
      const result = await service.createPenalty(createPenaltyDto);

      expect(result).toEqual(mockPenalty);
      expect(service.checkExsistPenaltyByBookLoan).toHaveBeenCalledWith('L001');
      expect(mockMembersService.findOneMember).toHaveBeenCalledWith('M001');
      expect(mockBookLoansService.findOneBookLoan).toHaveBeenCalledWith('L001');
      expect(mockPenaltyRepository.count).toHaveBeenCalled();
      expect(mockPenaltyRepository.create).toHaveBeenCalledWith({
        book_loan: mockBookLoan,
        member: mockMember,
        code: 'P001',
      });
      expect(mockPenaltyRepository.manager.save).toHaveBeenCalledWith(
        mockPenalty,
      );
    });

    it('should throw an error if penalty already exists', async () => {
      jest
        .spyOn(service, 'checkExsistPenaltyByBookLoan')
        .mockRejectedValue(new BadRequestException());

      await expect(service.createPenalty(createPenaltyDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAllPenalty', () => {
    it('should return an array of penalties', async () => {
      const mockPenalties = [
        {
          code: 'P001',
          penalty_start_date: '2024-09-27T07:56:17.422Z',
          penalty_end_date: '2024-09-30T07:56:17.422Z',
        },
        {
          code: 'P002',
          penalty_start_date: '2024-09-26T07:56:17.422Z',
          penalty_end_date: '2024-09-29T07:56:17.422Z',
        },
      ];
      mockPenaltyRepository.find.mockResolvedValue(mockPenalties);

      const result = await service.findAllPenalty();

      expect(result).toEqual(mockPenalties);
      expect(mockPenaltyRepository.find).toHaveBeenCalled();
    });
  });

  describe('findPenaltiesByMember', () => {
    it('should return penalties for a specific member', async () => {
      const memberCode = 'M001';
      const mockPenalties = [
        {
          code: 'P001',
          penalty_start_date: '2024-09-27T07:56:17.422Z',
          penalty_end_date: '2024-09-30T07:56:17.422Z',
          member: { code: memberCode },
        },
      ];
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockPenalties),
      };
      mockPenaltyRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.findPenaltiesByMember(memberCode);

      expect(result).toEqual(mockPenalties);
      expect(queryBuilder.where).toHaveBeenCalledWith(
        'penalties.member = :member',
        { member: memberCode },
      );
      expect(mockPenaltyRepository.createQueryBuilder).toHaveBeenCalledWith(
        'penalties',
      );
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledTimes(3);
      expect(queryBuilder.where).toHaveBeenCalledWith(
        'penalties.member = :member',
        { member: memberCode },
      );
      expect(queryBuilder.select).toHaveBeenCalled();
      expect(queryBuilder.orderBy).toHaveBeenCalledWith(
        'penalties.penalty_end_date',
        'DESC',
      );
      expect(queryBuilder.getMany).toHaveBeenCalled();
    });
  });

  describe('checkPenaltyMember', () => {
    it('should throw an error if member has an active penalty', async () => {
      const memberCode = 'M001';
      const mockPenalty = {
        member: { code: memberCode },
        penalty_end_date: new Date('2023-12-31'),
      };

      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockPenalty),
      };
      mockPenaltyRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      await expect(service.checkPenaltyMember(memberCode)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should not throw an error if member has no active penalty', async () => {
      const memberCode = 'M001';
      const queryBuilder = mockPenaltyRepository.createQueryBuilder();
      queryBuilder.getOne.mockResolvedValue(null);

      await expect(
        service.checkPenaltyMember(memberCode),
      ).resolves.not.toThrow();
    });
  });

  describe('checkExsistPenaltyByBookLoan', () => {
    it('should throw BadRequestException if penalty exists for book loan', async () => {
      const bookLoanCode = 'L001';
      const mockPenalty = {
        book_loan: { code: bookLoanCode },
        penalty_end_date: new Date('2023-12-31'),
      };

      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockPenalty),
      };
      mockPenaltyRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      await expect(
        service.checkExsistPenaltyByBookLoan(bookLoanCode),
      ).rejects.toThrow(BadRequestException);
    });

    it('should not throw an error if no penalty exists for book loan', async () => {
      const bookLoanCode = 'L001';

      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      mockPenaltyRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      await expect(
        service.checkExsistPenaltyByBookLoan(bookLoanCode),
      ).resolves.not.toThrow();
    });
  });
});
