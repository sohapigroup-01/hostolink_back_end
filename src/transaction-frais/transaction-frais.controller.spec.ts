import { Test, TestingModule } from '@nestjs/testing';
import { TransactionFraisController } from './transaction-frais.controller';

describe('TransactionFraisController', () => {
  let controller: TransactionFraisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionFraisController],
    }).compile();

    controller = module.get<TransactionFraisController>(TransactionFraisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
