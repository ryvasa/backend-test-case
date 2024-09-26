import { BookLoan } from 'src/book-loan/entities/book-loan.entity';
import { Member } from 'src/members/entities/member.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'penalties' })
export class Penalty {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Member, (member) => member.penalties)
  @JoinColumn({ name: 'member_code' })
  member: Member;

  @OneToOne(() => BookLoan, (bookLoan) => bookLoan.penalty)
  @JoinColumn({ name: 'book_loan_id' })
  book_loans: BookLoan;

  @CreateDateColumn()
  penalty_start_date: Date;

  @Column({ type: 'date' })
  penalty_end_date: Date;
}
