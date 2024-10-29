import pgPromise from "pg-promise"
import pg from "pg-promise/typescript/pg-subset"
import { FinancialOperation } from "./FinancialOperation"
import { Inject, Injectable } from "@nestjs/common"

interface SaveResult {
    totalInserted: number
    totalSuccess?: number
    failedOperations: { operation: FinancialOperation, reason: string }[]
}

@Injectable()
export class FinancialRepository {
    private static readonly UNIQUE_OPERATION_ERROR = "Unique Operation violation"

    constructor(@Inject('DbConnectionToken') private readonly db: pgPromise.IDatabase<{}, pg.IClient>) {}

    async saveFinancialData(
        operations: FinancialOperation[],
        suspiciousList: { isSuspicious: boolean, reason?: string }[]
    ): Promise<SaveResult> {
        const result: SaveResult = { totalInserted: 0, failedOperations: [] }

        for (const [index, operation] of operations.entries()) {
            const suspicious = suspiciousList[index]
            const saveResult = await this.attemptSaveOperation(operation, suspicious)

            if (saveResult.success) {
                result.totalInserted++
            } else {
                result.failedOperations.push({ operation, reason: saveResult.reason })
            }
        }
        result.totalSuccess = result.totalInserted - result.failedOperations.length
        return result
    }

    private async attemptSaveOperation(
        operation: FinancialOperation,
        suspicious: { isSuspicious: boolean, reason?: string }
    ): Promise<{ success: boolean, reason?: string }> {
        try {
            await this.insertOperation(operation, suspicious.isSuspicious, suspicious.reason);
            if (suspicious.isSuspicious) {
                return { success: false, reason: suspicious.reason};
            }
            return { success: true };
        } catch (error) {
            return { success: false, reason: this.getFailureReason(error) };
        }
    }

    private async insertOperation(
        operation: FinancialOperation,
        isSuspicious: boolean,
        reason: string | null
    ): Promise<void> {
        const { from, to, amount } = operation

        await this.db.oneOrNone(
            `INSERT INTO operations (sender, receiver, amount, suspicious, reason) 
             VALUES ($1, $2, $3, $4, $5)`,
            [from, to, amount, isSuspicious, reason]
        )
    }

    private getFailureReason(error: any): string {
        return error.constraint === 'unique_operation'
            ? FinancialRepository.UNIQUE_OPERATION_ERROR
            : error.message
    }
}
