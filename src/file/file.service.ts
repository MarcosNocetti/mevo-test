import { readFile } from "fs";
import { FinancialOperation } from "src/financial/FinancialOperation";
import fs from "fs/promises";
import csv from 'csvtojson'


export default class FileService {
    async readFinalcialOps(file: any): Promise<FinancialOperation[]> {
        csv()
            .fromFile(file)
            .then(function (jsonArrayObj) {
                return this.buildList(jsonArrayObj);
            })
        return
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