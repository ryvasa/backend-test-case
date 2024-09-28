import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMemberDto, UpdateMemberDto } from './dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {}
  async createMember(createMemberDto: CreateMemberDto): Promise<Member> {
    const count = await this.memberRepository.count();
    const member: Member = this.memberRepository.create(createMemberDto);
    member.code = `M${(count + 1).toString().padStart(3, '0')}`;
    return await this.memberRepository.save(member);
  }

  async findAllMember(): Promise<Member[]> {
    const members: Member[] = await this.memberRepository
      .createQueryBuilder('members')
      .leftJoinAndSelect(
        'members.book_loans',
        'book_loans',
        'book_loans.return_date IS NULL',
      )
      .leftJoinAndSelect('book_loans.book', 'book')
      .select([
        'members.code',
        'members.name',
        'book_loans',
        'book.code',
        'book.title',
        'book.author',
      ])
      .getMany();

    return members.map((member) => ({
      ...member,
      book_on_loan_count: member.book_loans.length,
    }));
  }

  async findAllMemberHistoryLoan(): Promise<Member[]> {
    const members: Member[] = await this.memberRepository
      .createQueryBuilder('members')
      .leftJoinAndSelect('members.book_loans', 'book_loans')
      .select(['members.code', 'members.name', 'book_loans'])
      .getMany();
    return members;
  }

  async findOneMember(code: string): Promise<Member> {
    const member: Member = await this.memberRepository.findOneBy({ code });
    if (!member) {
      throw new Error('Member not found');
    }
    return member;
  }

  async updateMember(
    code: string,
    updateMemberDto: UpdateMemberDto,
  ): Promise<Member> {
    const member: Member = await this.findOneMember(code);
    Object.assign(member, updateMemberDto);
    return this.memberRepository.save(member);
  }

  async deleteMember(code: string): Promise<object> {
    const member: Member = await this.findOneMember(code);
    await this.memberRepository.remove(member);
    return { message: 'Member is deleted successfully.' };
  }
}
