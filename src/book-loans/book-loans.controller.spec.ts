import { Test, TestingModule } from '@nestjs/testing';
import { BookLoansController } from './book-loans.controller';
import { BookLoansService } from './book-loans.service';

describe('BookLoansController', () => {
  let controller: BookLoansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookLoansController],
      providers: [BookLoansService],
    }).compile();

    controller = module.get<BookLoansController>(BookLoansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
