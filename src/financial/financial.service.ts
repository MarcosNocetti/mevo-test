import { FinancialRepository } from "./financial.repository";
import { FinancialOperation } from "./FinancialOperation";

export class FinancialService{
    constructor(private readonly repository: FinancialRepository){}

    async saveFinancialOperation(operation: FinancialOperation): Promise<void>{
       const isSuspicious = this.validateOperation(operation)
       this.repository.saveFinancialData(operation, isSuspicious)
    }

    private validateOperation(operation: FinancialOperation): any{
        if(operation.amount > 5000000){
            return {
                isSuspicious: true,
                reason: 'Amount above 5000000'
            }
        }
        if(operation.amount < 0){
            return {
                isSuspicious: true,
                reason: 'Negative Amount'
            }
        }
    }
}