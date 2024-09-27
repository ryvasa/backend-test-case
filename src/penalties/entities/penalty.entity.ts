import { BookLoan } from 'src/book-loans/entities/book-loan.entity';
import { Member } from 'src/members/entities/member.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';

@Entity({ name: 'penalties' })
export class Penalty {
  @Column({ unique: true, primary: true, type: 'varchar', length: 200 })
  code: string;

  @ManyToOne(() => Member, (member) => member.penalties, { nullable: false })
  @JoinColumn({ name: 'member_code' })
  member: Member;

  @OneToOne(() => BookLoan, (bookLoan) => bookLoan.penalty, {
    nullable: false,
    cascade: true,
  })
  @JoinColumn({ name: 'book_loan_code' })
  book_loan: BookLoan;

  @CreateDateColumn()
  penalty_start_date: Date;

  @Column({ type: 'timestamptz' })
  penalty_end_date: Date;

  @BeforeInsert()
  setPenaltyEndDate() {
    const borrowingDate = this.penalty_start_date || new Date();
    this.penalty_end_date = new Date(
      borrowingDate.getTime() + 3 * 24 * 60 * 60 * 1000,
    );
  }
}
