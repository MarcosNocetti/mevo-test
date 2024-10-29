import pgPromise from "pg-promise";
import pg from "pg-promise/typescript/pg-subset";
import { FinancialOperation } from "./FinancialOperation";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class FinancialRepository{
    constructor(@Inject('DbConnectionToken')private readonly db:  pgPromise.IDatabase<{}, pg.IClient>){}

    private static readonly DB_ERROR_MESSAGE = 'Erro ao salvar dados financeiros:';

    async saveFinancialData(operation: FinancialOperation, suspicious: { isSuspicious: boolean; reason?: string }): Promise<void> {
        const { isSuspicious, reason } = suspicious;
    
        try {
            await this.saveOperation(operation, isSuspicious, reason);
        } catch (error) {
            if (error.constraint === 'unique_operation') {
                await this.saveOperation(operation, isSuspicious, "Unique Operation violation");
            } else {
                throw error;
            }
        }
    }
    
    private async saveOperation(operation: FinancialOperation, isSuspicious: boolean, reason: string | null): Promise<void> {
        const { from, to, amount } = operation;
    
        await this.db.none(
            `INSERT INTO operations (sender, receiver, amount, suspicious, reason) 
             VALUES ($1, $2, $3, $4, $5) `,
            [from, to, amount, isSuspicious, reason]
        );
    }
    
}