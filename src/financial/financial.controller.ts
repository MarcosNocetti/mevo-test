import { Controller, HttpException, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import FileService from 'src/file/file.service';
import { FinancialService } from './financial.service';

@Controller()
export class FinancialController {
  constructor(
    private readonly fileService: FileService,
    private readonly financialService: FinancialService
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any) {
    try {
      const operations = await this.fileService.readFinalcialOps(file);
      await this.processOperations(operations);
    } catch (error) {
      this.handleFileUploadError(error);
    }
  }

  private async processOperations(operations: any[]): Promise<void> {
    await Promise.all(
      operations.map((operation) =>
        this.financialService.saveFinancialOperation(operation).catch((error) =>
          this.handleOperationError(error)
        )
      )
    );
  }

  private handleFileUploadError(error: any): never {
    throw new HttpException(
      `An error occurred during file upload: ${error.message}`,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  private handleOperationError(error: any): never {
    throw new HttpException(
      `Failed to save operation: ${error.message}`,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
