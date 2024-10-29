import { Module } from '@nestjs/common'
import { FinancialController } from './financial.controller'
import { DatabaseModule } from 'src/database/database.module'
import FileService from 'src/file/file.service'
import { FinancialService } from './financial.service';
import { FinancialRepository } from './financial.repository'

@Module({
  imports: [DatabaseModule],
  controllers: [FinancialController],
  providers: [FileService, FinancialService, FinancialRepository],
})
export class FinancialModule {}
