import { BookLoan } from 'src/book-loans/entities/book-loan.entity';
import { Penalty } from 'src/penalties/entities/penalty.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'members' })
export class Member {
  @Column({ unique: true, primary: true, type: 'varchar', length: 200 })
  code: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;

  @OneToMany(() => BookLoan, (bookLoan) => bookLoan.member, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  book_loans: BookLoan[];

  @OneToMany(() => Penalty, (penalty) => penalty.member, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  penalties: Penalty[];
}
