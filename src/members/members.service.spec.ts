import { Test, TestingModule } from '@nestjs/testing';
import { MembersService } from './members.service';
import { Member } from './entities/member.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateMemberDto, UpdateMemberDto } from './dto';

describe('MemberService', () => {
  let service: MembersService;
  let membersRepository: Repository<Member>;

  const MEMBER_REPOSITORY_TOKEN = getRepositoryToken(Member);

  const mockMemberRepository = {
    create: jest.fn(),
    save: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
    findOneBy: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: MEMBER_REPOSITORY_TOKEN,
          useValue: mockMemberRepository,
        },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
    membersRepository = module.get<Repository<Member>>(MEMBER_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('membersRepository should be defined', () => {
    expect(membersRepository).toBeDefined();
  });

  describe('createMember', () => {
    it('should create a new member', async () => {
      const createMemberDto: CreateMemberDto = { name: 'John Doe' };
      const mockMember = { code: 'M001', name: 'John Doe' };

      mockMemberRepository.count.mockResolvedValue(0);
      mockMemberRepository.create.mockReturnValue(mockMember);
      mockMemberRepository.save.mockResolvedValue(mockMember);

      const result = await service.createMember(createMemberDto);

      expect(result).toEqual(mockMember);
      expect(mockMemberRepository.count).toHaveBeenCalled();
      expect(mockMemberRepository.create).toHaveBeenCalledWith(createMemberDto);
      expect(mockMemberRepository.save).toHaveBeenCalledWith(mockMember);
    });
  });

  describe('findAllMember', () => {
    it('should return all members with active book loans', async () => {
      const mockMembers = [
        { code: 'M001', name: 'John Doe', book_loans: [{ code: 'L001' }] },
        { code: 'M002', name: 'Jane Doe', book_loans: [] },
      ];

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockMembers),
      };

      mockMemberRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAllMember();

      expect(result).toEqual([
        { ...mockMembers[0], book_on_loan_count: 1 },
        { ...mockMembers[1], book_on_loan_count: 0 },
      ]);
    });
  });

  describe('findAllMemberHistoryLoan', () => {
    it('should return all members with their loan history', async () => {
      const mockMembers = [
        {
          code: 'M001',
          name: 'John Doe',
          book_loans: [{ code: 'L001' }, { code: 'L002' }],
        },
        { code: 'M002', name: 'Jane Doe', book_loans: [] },
      ];

      mockMemberRepository
        .createQueryBuilder()
        .getMany.mockResolvedValue(mockMembers);

      const result = await service.findAllMemberHistoryLoan();

      expect(result).toEqual(mockMembers);
    });
  });

  describe('findOneMember', () => {
    it('should return a member by code', async () => {
      const mockMember = { code: 'M001', name: 'John Doe' };

      mockMemberRepository.findOneBy.mockResolvedValue(mockMember);

      const result = await service.findOneMember('M001');

      expect(result).toEqual(mockMember);
      expect(mockMemberRepository.findOneBy).toHaveBeenCalledWith({
        code: 'M001',
      });
    });

    it('should throw an error if member is not found', async () => {
      mockMemberRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOneMember('M001')).rejects.toThrow(
        'Member not found',
      );
      expect(mockMemberRepository.findOneBy).toHaveBeenCalledWith({
        code: 'M001',
      });
    });
  });

  describe('updateMember', () => {
    function createMockMember(overrides = {}) {
      return {
        code: 'M001',
        name: 'John Doe',
        created_date: new Date('2024-09-1'),
        updated_date: new Date('2024-09-1'),
        penalties: [],
        book_loans: [],
        ...overrides,
      };
    }
    const mockMember = createMockMember();
    it('should update a member', async () => {
      const updateMemberDto: UpdateMemberDto = { name: 'John Updated' };
      const updatedMember = { ...mockMember, ...updateMemberDto };

      jest.spyOn(service, 'findOneMember').mockResolvedValue(mockMember);
      mockMemberRepository.save.mockResolvedValue(updatedMember);

      const result = await service.updateMember('M001', updateMemberDto);

      expect(result).toEqual(updatedMember);
      expect(service.findOneMember).toHaveBeenCalledWith('M001');
      expect(mockMemberRepository.save).toHaveBeenCalledWith(updatedMember);
    });

    it('should throw NotFoundException if member is not found', async () => {
      const updateMemberDto: UpdateMemberDto = { name: 'John Updated' };

      jest
        .spyOn(service, 'findOneMember')
        .mockRejectedValue(new NotFoundException('Member not found'));

      await expect(
        service.updateMember('M001', updateMemberDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteMember', () => {
    function createMockMember(overrides = {}) {
      return {
        code: 'M001',
        name: 'John Doe',
        created_date: new Date('2024-09-1'),
        updated_date: new Date('2024-09-1'),
        penalties: [],
        book_loans: [],
        ...overrides,
      };
    }
    const mockMember = createMockMember();
    it('should delete a member', async () => {
      jest.spyOn(service, 'findOneMember').mockResolvedValue(mockMember);
      mockMemberRepository.remove.mockResolvedValue(mockMember);

      const result = await service.deleteMember('M001');

      expect(result).toEqual({ message: 'Member is deleted successfully.' });
      expect(service.findOneMember).toHaveBeenCalledWith('M001');
      expect(mockMemberRepository.remove).toHaveBeenCalledWith(mockMember);
    });
    it('should throw NotFoundException if member is not found', async () => {
      jest
        .spyOn(service, 'findOneMember')
        .mockRejectedValue(new NotFoundException('Member not found'));

      await expect(service.deleteMember('M001')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
