import { BookLoan } from 'src/book-loan/entities/book-loan.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'books' })
export class Book {
  @Column({ unique: true, primary: true, type: 'varchar', length: 200 })
  code: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'varchar', length: 200 })
  author: string;

  @Column({ type: 'integer' })
  stock: number;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;

  @OneToMany(() => BookLoan, (bookLoan) => bookLoan.book)
  book_loans: BookLoan[];
}
