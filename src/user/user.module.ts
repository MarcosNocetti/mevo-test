import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database/database.module'
import { UserService } from './user.service'
import { UserRepository } from './user.repository'
import { UserController } from './user.controller'

@Module({
    imports: [DatabaseModule],
    controllers: [UserController],
    providers: [UserService, UserRepository],
    exports: [UserService], 
})
export class UserModule {}
