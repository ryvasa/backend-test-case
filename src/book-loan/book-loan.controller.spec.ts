import { Test, TestingModule } from '@nestjs/testing';
import { BookLoanController } from './book-loan.controller';
import { BookLoanService } from './book-loan.service';

describe('BookLoanController', () => {
  let controller: BookLoanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookLoanController],
      providers: [BookLoanService],
    }).compile();

    controller = module.get<BookLoanController>(BookLoanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
