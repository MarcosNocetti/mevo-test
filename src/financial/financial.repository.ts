import pgPromise from "pg-promise";
import pg from "pg-promise/typescript/pg-subset";
import { FinancialOperation } from "./FinancialOperation";

export class FinancialRepository{
    constructor(private readonly db:  pgPromise.IDatabase<{}, pg.IClient>){}

    saveFinancialData(operation: FinancialOperation, isSuspicious: any){
        this.db.oneOrNone('')
        this.db.oneOrNone('')
    }
}