import { Book } from 'src/books/entities/book.entity';
import { Member } from 'src/members/entities/member.entity';
import { Penalty } from 'src/penalties/entities/penalty.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';

@Entity({ name: 'book_loans' })
export class BookLoan {
  @Column({ unique: true, primary: true, type: 'varchar', length: 200 })
  code: string;

  @ManyToOne(() => Book, (book) => book.book_loans, { nullable: false })
  @JoinColumn({ name: 'book_code' })
  book: Book;

  @ManyToOne(() => Member, (member) => member.book_loans, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'member_code' })
  member: Member;

  @OneToOne(() => Penalty, (penalty) => penalty.book_loan, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  penalty?: Penalty;

  @CreateDateColumn()
  borrowing_date: Date;

  @Column({ type: 'timestamptz', nullable: true })
  expected_return_date?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  return_date?: Date;

  @BeforeInsert()
  setExpectedReturnDate() {
    const borrowingDate = this.borrowing_date || new Date();
    this.expected_return_date = new Date(
      borrowingDate.getTime() + 7 * 24 * 60 * 60 * 1000,
    );
  }
}
