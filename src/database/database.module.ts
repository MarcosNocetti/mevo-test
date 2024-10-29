import { Module } from '@nestjs/common'
import { DbProvider } from './db'

@Module({
  providers: [DbProvider],
  exports: [DbProvider], 
})
export class DatabaseModule {}