import { Test, TestingModule } from '@nestjs/testing';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto';
import { Member } from './entities/member.entity';
import { NotFoundException } from '@nestjs/common';

describe('MembersController', () => {
  let controller: MembersController;
  let membersService: MembersService;

  const mockMembersService = {
    findAllMember: jest.fn(),
    createMember: jest.fn(),
    findAllMemberHistoryLoan: jest.fn(),
    findOneMember: jest.fn(),
    updateMember: jest.fn(),
    deleteMember: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembersController],
      providers: [{ provide: MembersService, useValue: mockMembersService }],
    }).compile();

    controller = module.get<MembersController>(MembersController);
    membersService = module.get<MembersService>(MembersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('membersService should be defined', () => {
    expect(membersService).toBeDefined();
  });

  describe('createMember', () => {
    it('should return Member', async () => {
      const createMemberDto: CreateMemberDto = {
        name: 'test',
      };

      mockMembersService.createMember.mockResolvedValue(createMemberDto);

      const member: Member = await controller.createMember(createMemberDto);

      expect(member).toBeDefined();
      expect(mockMembersService.createMember).toHaveBeenCalledWith(
        createMemberDto,
      );
    });
  });

  describe('findAllMember', () => {
    it('should return Member', async () => {
      const mockMembers: Member[] = [
        {
          code: 'M001',
          name: 'John Doe',
          created_date: new Date('2024-09-1'),
          updated_date: new Date('2024-09-1'),
          penalties: [],
          book_loans: [],
        },
      ];

      mockMembersService.findAllMember.mockResolvedValue(mockMembers);

      const member: Member[] = await controller.findAllMember();

      expect(member).toBeDefined();
      expect(mockMembersService.findAllMember).toHaveBeenCalled();
    });
  });

  describe('findAllMemberHistoryLoan', () => {
    it('should return Member', async () => {
      const members: Member[] = [];

      mockMembersService.findAllMemberHistoryLoan.mockResolvedValue(members);

      const member: Member[] = await controller.findAllMemberHistoryLoan();

      expect(member).toBeDefined();
      expect(mockMembersService.findAllMemberHistoryLoan).toHaveBeenCalled();
    });
  });

  describe('findOneMember', () => {
    it('should return Member', async () => {
      const mockMember: Member = {
        code: 'M001',
        name: 'John Doe',
        created_date: new Date('2024-09-1'),
        updated_date: new Date('2024-09-1'),
        penalties: [],
        book_loans: [],
      };

      mockMembersService.findOneMember.mockResolvedValue(mockMember);

      const member: Member = await controller.findOneMember('M001');

      expect(member).toBeDefined();
      expect(mockMembersService.findOneMember).toHaveBeenCalledWith('M001');
    });
    it('should throw NotFoundException if member is not found', async () => {
      mockMembersService.findOneMember.mockRejectedValue(
        new NotFoundException('Member not found'),
      );

      await expect(controller.findOneMember('M001')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateMember', () => {
    it('should return Member', async () => {
      const mockMember: Member = {
        code: 'M001',
        name: 'John Doe',
        created_date: new Date('2024-09-1'),
        updated_date: new Date('2024-09-1'),
        penalties: [],
        book_loans: [],
      };

      mockMembersService.updateMember.mockResolvedValue(mockMember);

      const member: Member = await controller.updateMember('M001', {
        name: 'John Doe Updated',
      });

      expect(member).toBeDefined();
      expect(mockMembersService.updateMember).toHaveBeenCalledWith('M001', {
        name: 'John Doe Updated',
      });
    });

    it('should throw NotFoundException if member is not found', async () => {
      mockMembersService.updateMember.mockRejectedValue(
        new NotFoundException('Member not found'),
      );

      await expect(
        controller.updateMember('M001', {
          name: 'John Doe Updated',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
  describe('deleteMember', () => {
    it('should delete Member', async () => {
      const expectedResult = { message: 'Member is deleted successfully.' };

      mockMembersService.deleteMember.mockResolvedValue(expectedResult);

      const result = await controller.deleteMember('M001');

      expect(result).toEqual(expectedResult);
      expect(mockMembersService.deleteMember).toHaveBeenCalledWith('M001');
    });

    it('should throw NotFoundException if member is not found', async () => {
      mockMembersService.deleteMember.mockRejectedValue(
        new NotFoundException('Member not found'),
      );

      await expect(controller.deleteMember('M001')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
