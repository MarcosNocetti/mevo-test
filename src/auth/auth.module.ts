
import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserModule } from '../user/user.module'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { config } from '../configs'

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: config.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
