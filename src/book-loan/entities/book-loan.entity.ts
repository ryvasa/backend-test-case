import { Book } from 'src/books/entities/book.entity';
import { Member } from 'src/members/entities/member.entity';
import { Penalty } from 'src/penalty/entities/penalty.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'book_loans' })
export class BookLoan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Book, (book) => book.book_loans)
  @JoinColumn({ name: 'book_code' })
  book: Book;

  @ManyToOne(() => Member, (member) => member.book_loans)
  @JoinColumn({ name: 'member_code' })
  member: Member;

  @OneToOne(() => Penalty, (penalty) => penalty.book_loans)
  penalty: Penalty;

  @CreateDateColumn()
  borrowing_date: Date;

  @Column({ type: 'date' })
  expected_return_date: Date;

  @Column({ type: 'date' })
  return_date: Date;
}
