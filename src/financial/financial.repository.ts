import pgPromise from "pg-promise";
import pg from "pg-promise/typescript/pg-subset";
import { FinancialOperation } from "./FinancialOperation";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class FinancialRepository{
    constructor(@Inject('DbConnectionToken')private readonly db:  pgPromise.IDatabase<{}, pg.IClient>){}

    private static readonly DB_ERROR_MESSAGE = 'Erro ao salvar dados financeiros:';

    async saveFinancialData(operation: FinancialOperation, suspicious: any): Promise<void> {
        try {
            const operationId = await this.saveOperation(operation, suspicious.isSuspicious);

            if (suspicious.isSuspicious && suspicious.reason) {
                await this.saveAnalytics(operationId, suspicious.reason);
            }
        } catch (error) {
            console.error(FinancialRepository.DB_ERROR_MESSAGE, error);
            throw error;
        }
    }

    private async saveOperation(operation: FinancialOperation, isSuspicious: boolean): Promise<string> {
        const { from, to, amount } = operation;

        const result = await this.db.one<{ id: string }>(
            `INSERT INTO operations (sender, receiver, amount, suspicious) 
             VALUES ($1, $2, $3, $4) 
             RETURNING id`,
            [from, to, amount, isSuspicious]
        );

        return result.id;
    }

    private async saveAnalytics(operationId: string, suspicionReason: string): Promise<void> {
        await this.db.none(
            `INSERT INTO operations_analytics (suspicious_operation_id, reason) 
             VALUES ($1, $2)`,
            [operationId, suspicionReason]
        );
    }
}