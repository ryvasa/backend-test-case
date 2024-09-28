import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreatePenaltyDto } from './dto/create-penalty.dto';
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
    await this.checkExsistPenaltyByBookLoan(createPenaltyDto.book_loan_code);

    const manager = queryRunner
      ? queryRunner.manager
      : this.penaltyRepository.manager;

    const member: Member = await this.membersService.findOneMember(
      createPenaltyDto.member_code,
    );
    const bookLoan: BookLoan = await this.bookLoansService.findOneBookLoan(
      createPenaltyDto.book_loan_code,
    );
    const count: number = await this.penaltyRepository.count();

    const penalty: Penalty = this.penaltyRepository.create({
      book_loan: bookLoan,
      member,
      code: `P${(count + 1).toString().padStart(3, '0')}`,
    });

    return manager.save(penalty);
  }

  findAllPenalty(): Promise<Penalty[]> {
    return this.penaltyRepository.find();
  }

  async findPenaltiesByMember(code: string): Promise<Penalty[]> {
    const penalty = await this.penaltyRepository
      .createQueryBuilder('penalties')
      .leftJoinAndSelect('penalties.member', 'member')
      .leftJoinAndSelect('penalties.book_loan', 'book_loan')
      .leftJoinAndSelect('book_loan.book', 'book')
      .where('penalties.member = :member', { member: code })
      .select([
        'penalties.code',
        'penalties.penalty_start_date',
        'penalties.penalty_end_date',
        'member.code',
        'member.name',
        'book_loan',
        'book.code',
        'book.title',
        'book.author',
      ])
      .orderBy('penalties.penalty_end_date', 'DESC')
      .getMany();

    return penalty;
  }

  async checkPenaltyMember(code: string): Promise<void> {
    // mengambil hanya satu data dengan penalty end date paling lama
    const penalty = await this.penaltyRepository
      .createQueryBuilder('penalties')
      .leftJoinAndSelect('penalties.member', 'member')
      .where('penalties.member = :member', { member: code })
      .andWhere('penalties.penalty_end_date > :date', { date: new Date() })
      .orderBy('penalties.penalty_end_date', 'DESC')
      .getOne();

    if (penalty) {
      throw new Error(
        `Member ${penalty.member.code} memiliki penalty sampai tanggal ${penalty.penalty_end_date}`,
      );
    }
  }

  async checkExsistPenaltyByBookLoan(code: string): Promise<void> {
    const penalty = await this.penaltyRepository
      .createQueryBuilder('penalties')
      .leftJoinAndSelect('penalties.book_loan', 'book_loan')
      .where('book_loan.code = :code', { code })
      .getOne();

    if (penalty) {
      throw new BadRequestException(
        `Peminjaman ${penalty.book_loan.code} telah diberikan penalty sebelumnya, dan akan selesai pada ${penalty.penalty_end_date}`,
      );
    }
  }
}
