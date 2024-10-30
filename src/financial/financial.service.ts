import { Injectable } from '@nestjs/common'
import { FinancialRepository } from './financial.repository'
import { FinancialOperation } from './FinancialOperation'

@Injectable()
export class FinancialService {
  constructor(private readonly repository: FinancialRepository) {}

  async saveFinancialOperation(
    operations: FinancialOperation[],
  ): Promise<{
    totalInserted: number;
    failedOperations: { operation: FinancialOperation; reason: string }[];
  }> {
    const suspiciousList = operations.map((operation) =>
      this.evaluateOperationSuspicion(operation),
    )

    const result = await this.repository.saveFinancialData(
      operations,
      suspiciousList,
    )

    return result
  }

  private evaluateOperationSuspicion(operation: FinancialOperation): {
    isSuspicious: boolean;
    reason?: string;
  } {
    if (parseInt(operation.amount) > 5000000) {
      return { isSuspicious: true, reason: 'Amount above 5000000' }
    }
    if (parseInt(operation.amount) < 0) {
      return { isSuspicious: true, reason: 'Negative Amount' }
    }
    return { isSuspicious: false }
  }
}
