import { Module } from '@nestjs/common';
import { FinancialController } from './financial.controller';
import { DatabaseModule } from 'src/database/database.module';
import FileService from 'src/file/file.service';

@Module({
  imports: [],
  controllers: [FinancialController],
  providers: [FileService],
})
export class FinancialModule {}
