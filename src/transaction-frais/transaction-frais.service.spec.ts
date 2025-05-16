import { Test, TestingModule } from '@nestjs/testing';
import { TransactionFraisService } from './transaction-frais.service';

describe('TransactionFraisService', () => {
  let service: TransactionFraisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionFraisService],
    }).compile();

    service = module.get<TransactionFraisService>(TransactionFraisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
