import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {}
  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const member: Member = this.memberRepository.create(createMemberDto);
    return await this.memberRepository.save(member);
  }

  async findAll(): Promise<Member[]> {
    return await this.memberRepository.find();
  }

  async findOne(code: string): Promise<Member> {
    const member: Member = await this.memberRepository.findOneBy({ code });
    if (!member) {
      throw new Error('Member not found');
    }
    return member;
  }

  async update(
    code: string,
    updateMemberDto: UpdateMemberDto,
  ): Promise<Member> {
    const member: Member = await this.findOne(code);
    Object.assign(member, updateMemberDto);
    return this.memberRepository.save(member);
  }

  async remove(code: string): Promise<object> {
    const member: Member = await this.findOne(code);
    await this.memberRepository.remove(member);
    return { message: 'Member has been deleted!' };
  }
}
