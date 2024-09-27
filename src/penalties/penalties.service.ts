import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreatePenaltyDto } from './dto/create-penalty.dto';
import { UpdatePenaltyDto } from './dto/update-penalty.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Penalty } from './entities/penalty.entity';
import { QueryRunner, Repository } from 'typeorm';
import { MembersService } from 'src/members/members.service';
import { Member } from 'src/members/entities/member.entity';
import { BookLoan } from 'src/book-loans/entities/book-loan.entity';
import { BookLoansService } from 'src/book-loans/book-loans.service';

@Injectable()
export class PenaltiesService {
  constructor(
    @InjectRepository(Penalty) private penaltyRepository: Repository<Penalty>,
    private readonly membersService: MembersService,
    @Inject(forwardRef(() => BookLoansService))
    private readonly bookLoansService: BookLoansService,
  ) {}

  async createPenalty(
    createPenaltyDto: CreatePenaltyDto,
    queryRunner?: QueryRunner,
  ): Promise<Penalty> {
    const manager = queryRunner
      ? queryRunner.manager
      : this.penaltyRepository.manager;

    const member: Member = await this.membersService.findOne(
      createPenaltyDto.member_code,
    );
    const bookLoan: BookLoan = await this.bookLoansService.findOne(
      createPenaltyDto.book_loan_code,
    );
    const count: number = await this.penaltyRepository.count();

    const penalty: Penalty = this.penaltyRepository.create({
      book_loan: bookLoan,
      member,
      code: `P${(count + 1).toString().padStart(3, '0')}`,
    });

    return manager.save(penalty);
    // return this.penaltyRepository.save(penalty);
  }

  findAllPenalty(): Promise<Penalty[]> {
    return this.penaltyRepository.find();
  }

  async findOnePenaltyByMember(code: string): Promise<any> {
    const penalty = this.penaltyRepository
      .createQueryBuilder('penalties')
      .leftJoinAndSelect('penalties.member', 'member')
      .where('penalties.member = :member', { member: code });

    return penalty;
  }
}
