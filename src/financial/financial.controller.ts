import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import FileService from 'src/file/file.service';
import { FinancialService } from './financial.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
@UseGuards(AuthGuard('jwt'))
export class FinancialController {
  constructor(
    private readonly fileService: FileService,
    private readonly financialService: FinancialService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const operations = await this.fileService.readFinalcialOps(file);
      const result = await this.processOperations(operations);
      return result;
    } catch (error) {
      if (!file || file.size === 0) {
        throw new HttpException('file should not be empty', HttpStatus.BAD_REQUEST);
      }
      this.handleFileUploadError(error);
    }
  }

  private async processOperations(operations: any[]): Promise<{
    totalInserted: number;
    failedOperations: { operation: any; reason: string }[];
  }> {
    try {
      return await this.financialService.saveFinancialOperation(operations);
    } catch (error) {
      this.handleOperationError(error);
    }
  }

  private handleFileUploadError(error: any): never {
    throw new HttpException(
      `An error occurred during file upload: ${error.message}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  private handleOperationError(error: any): never {
    throw new HttpException(
      `Failed to save operation: ${error.message}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
