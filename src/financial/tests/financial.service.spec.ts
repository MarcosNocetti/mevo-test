import { Test, TestingModule } from '@nestjs/testing';
import { FinancialService } from '../financial.service';
import { FinancialRepository } from '../financial.repository';
import { FinancialOperation } from '../FinancialOperation';

const mockRepository = {
  saveFinancialData: jest.fn(),
};

describe('FinancialService', () => {
  let service: FinancialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinancialService,
        { provide: FinancialRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<FinancialService>(FinancialService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveFinancialOperation', () => {
    it('should save operations and return result', async () => {
      const operations: FinancialOperation[] = [
        { from: 'account1', to: 'account2', amount: '100' },
      ];
      const saveResult = { totalInserted: 1, failedOperations: [] };
      mockRepository.saveFinancialData.mockResolvedValueOnce(saveResult);

      const result = await service.saveFinancialOperation(operations);

      expect(result).toEqual(saveResult);
      expect(mockRepository.saveFinancialData).toHaveBeenCalledWith(
        operations,
        expect.any(Array),
      );
    });

    it('should evaluate suspicion for amount above limit', async () => {
      const operations: FinancialOperation[] = [
        { from: 'account1', to: 'account2', amount: '6000000' },
      ];
      const saveResult = { totalInserted: 1, failedOperations: [] };
      mockRepository.saveFinancialData.mockResolvedValueOnce(saveResult);

      const result = await service.saveFinancialOperation(operations);

      expect(result).toEqual(saveResult);
      expect(mockRepository.saveFinancialData).toHaveBeenCalledWith(
        operations,
        [{ isSuspicious: true, reason: 'Amount above 5000000' }],
      );
    });

    it('should evaluate suspicion for negative amount', async () => {
      const operations: FinancialOperation[] = [
        { from: 'account1', to: 'account2', amount: '-100' },
      ];
      const saveResult = { totalInserted: 1, failedOperations: [] };
      mockRepository.saveFinancialData.mockResolvedValueOnce(saveResult);

      const result = await service.saveFinancialOperation(operations);

      expect(result).toEqual(saveResult);
      expect(mockRepository.saveFinancialData).toHaveBeenCalledWith(
        operations,
        [{ isSuspicious: true, reason: 'Negative Amount' }],
      );
    });

    it('should evaluate operations and determine if suspicious or not', async () => {
      const operations: FinancialOperation[] = [
        { from: 'account1', to: 'account2', amount: '100' },
        { from: 'account2', to: 'account1', amount: '6000000' },
        { from: 'account3', to: 'account4', amount: '-100' },
      ];
      const saveResult = { totalInserted: 1, failedOperations: [] };
      mockRepository.saveFinancialData.mockResolvedValueOnce(saveResult);

      const result = await service.saveFinancialOperation(operations);

      expect(result).toEqual(saveResult);
      expect(mockRepository.saveFinancialData).toHaveBeenCalledWith(
        operations,
        [
          { isSuspicious: false },
          { isSuspicious: true, reason: 'Amount above 5000000' },
          { isSuspicious: true, reason: 'Negative Amount' },
        ],
      );
    });
  });

  describe('evaluateOperationSuspicion', () => {
    it('should return suspicious for amount above limit', () => {
      const operation: FinancialOperation = {
        from: 'account1',
        to: 'account2',
        amount: '6000001',
      };
      const result = service['evaluateOperationSuspicion'](operation);
      expect(result).toEqual({
        isSuspicious: true,
        reason: 'Amount above 5000000',
      });
    });

    it('should return suspicious for negative amount', () => {
      const operation: FinancialOperation = {
        from: 'account1',
        to: 'account2',
        amount: '-100',
      };
      const result = service['evaluateOperationSuspicion'](operation);
      expect(result).toEqual({ isSuspicious: true, reason: 'Negative Amount' });
    });

    it('should return not suspicious for valid amount', () => {
      const operation: FinancialOperation = {
        from: 'account1',
        to: 'account2',
        amount: '100',
      };
      const result = service['evaluateOperationSuspicion'](operation);
      expect(result).toEqual({ isSuspicious: false });
    });
  });
});
