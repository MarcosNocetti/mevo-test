import { readFile } from "fs"
import { FinancialOperation } from "src/financial/FinancialOperation"
import fs from "fs/promises"
import * as csv from 'csvtojson'
import { Readable } from "stream"


export default class FileService {
    async readFinalcialOps(file: any): Promise<FinancialOperation[]> {
       return csv().fromStream(Readable.from(file.buffer))
    }

    private buildList(jsonArrayObj: any[]) {
        jsonArrayObj.map( (operation: any) => {
            return {
                from: operation.from,
                to: operation.to,
                amount: operation.amount
            }
        })
        
    }
}