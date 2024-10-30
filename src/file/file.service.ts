import { FinancialOperation } from 'src/financial/FinancialOperation';
import * as csv from 'csvtojson';
import { Readable } from 'stream';

export default class FileService {
  async readFinalcialOps(
    file: Express.Multer.File,
  ): Promise<FinancialOperation[]> {
    return csv().fromStream(Readable.from(file.buffer));
  }

  private buildList(jsonArrayObj: any[]) {
    jsonArrayObj.map((operation: any) => {
      return {
        from: operation.from,
        to: operation.to,
        amount: operation.amount,
      };
    });
  }
}
