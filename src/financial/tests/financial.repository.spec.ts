import { Test, TestingModule } from '@nestjs/testing'
import { FinancialRepository } from '../financial.repository'
import { FinancialOperation } from '../FinancialOperation'

const UNIQUE_OPERATION_ERROR = 'Unique Operation violation'

const mockDb = {
  oneOrNone: jest.fn(),
}

describe('FinancialRepository', () => {
  let repository: FinancialRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinancialRepository,
        { provide: 'DbConnectionToken', useValue: mockDb },
      ],
    }).compile()

    repository = module.get<FinancialRepository>(FinancialRepository)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('saveFinancialData', () => {
    it('should insert operations successfully', async () => {
      const operations: FinancialOperation[] = [
        { from: 'account1', to: 'account2', amount: '100' },
      ]
      const suspiciousList = [{ isSuspicious: false }]

      mockDb.oneOrNone.mockResolvedValueOnce(undefined)

      const result = await repository.saveFinancialData(
        operations,
        suspiciousList,
      )

      expect(result.totalInserted).toBe(1)
      expect(result.failedOperations).toEqual([])
      expect(result.totalSuccess).toBe(1)
      expect(mockDb.oneOrNone).toHaveBeenCalledTimes(1)
    })

    it('should handle failed operations', async () => {
      const operations: FinancialOperation[] = [
        { from: 'account1', to: 'account2', amount: '100' },
      ]
      const suspiciousList = [{ isSuspicious: false }]

      mockDb.oneOrNone.mockRejectedValueOnce({ message: 'Error' })

      const result = await repository.saveFinancialData(
        operations,
        suspiciousList,
      )

      expect(result.totalInserted).toBe(1)
      expect(result.failedOperations).toHaveLength(1)
      expect(result.failedOperations[0].operation).toEqual(operations[0])
      expect(result.failedOperations[0].reason).toBe('Error')
      expect(result.totalSuccess).toBe(0)
    })

    it('should handle suspicious operations', async () => {
      const operations: FinancialOperation[] = [
        { from: 'account1', to: 'account2', amount: '100' },
      ]
      const suspiciousList = [
        { isSuspicious: true, reason: 'Suspicious activity' },
      ]

      mockDb.oneOrNone.mockResolvedValueOnce(undefined)

      const result = await repository.saveFinancialData(
        operations,
        suspiciousList,
      )

      expect(result.totalInserted).toBe(1)
      expect(result.failedOperations).toHaveLength(1)
      expect(result.failedOperations[0].operation).toEqual(operations[0])
      expect(result.failedOperations[0].reason).toBe('Suspicious activity')
      expect(result.totalSuccess).toBe(0)
    })

    it('should insert multiple operations and handle mixed results', async () => {
      const operations: FinancialOperation[] = [
        { from: 'account1', to: 'account2', amount: '100' },
        { from: 'account2', to: 'account1', amount: '200' },
      ]
      const suspiciousList = [
        { isSuspicious: false },
        { isSuspicious: true, reason: 'Suspicious activity' },
      ]

      mockDb.oneOrNone
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce({ message: 'Error' })

      const result = await repository.saveFinancialData(
        operations,
        suspiciousList,
      )

      expect(result.totalInserted).toBe(2)
      expect(result.failedOperations).toHaveLength(1)
      expect(result.failedOperations[0].operation).toEqual(operations[1])
      expect(result.failedOperations[0].reason).toBe('Error')
      expect(result.totalSuccess).toBe(1)
    })
  })

  describe('attemptSaveOperation', () => {
    it('should return success when operation is saved', async () => {
      const operation: FinancialOperation = {
        from: 'account1',
        to: 'account2',
        amount: '100',
      }
      const suspicious = { isSuspicious: false }

      mockDb.oneOrNone.mockResolvedValueOnce(undefined)

      const result = await repository['attemptSaveOperation'](
        operation,
        suspicious,
      )

      expect(result.success).toBe(true)
    })

    it('should return failure with reason for unique constraint error', async () => {
      const operation: FinancialOperation = {
        from: 'account1',
        to: 'account2',
        amount: '100',
      }
      const suspicious = { isSuspicious: false }

      mockDb.oneOrNone.mockRejectedValueOnce({
        constraint: 'unique_operation',
      })

      const result = await repository['attemptSaveOperation'](
        operation,
        suspicious,
      )

      expect(result.success).toBe(false)
      expect(result.reason).toBe(UNIQUE_OPERATION_ERROR)
    })

    it('should return failure with error message', async () => {
      const operation: FinancialOperation = {
        from: 'account1',
        to: 'account2',
        amount: '100',
      }
      const suspicious = { isSuspicious: false }

      mockDb.oneOrNone.mockRejectedValueOnce({ message: 'Some error' })

      const result = await repository['attemptSaveOperation'](
        operation,
        suspicious,
      )

      expect(result.success).toBe(false)
      expect(result.reason).toBe('Some error')
    })
  })
})
