import { Body, Controller, Get, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FinancialOperation } from './FinancialOperation';
import { FileInterceptor } from '@nestjs/platform-express';
import FileService from 'src/file/file.service';
import { FinancialService } from './financial.service';

@Controller()
export class FinancialController {
  constructor(private readonly fileService: FileService, private readonly financialService: FinancialService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any) {
    const listOperations = await this.fileService.readFinalcialOps(file)
    listOperations.forEach(it =>{
      this.financialService.saveFinancialOperation(it)
    })
  }
  
}
