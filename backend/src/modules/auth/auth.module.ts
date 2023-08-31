import { Module } from '@nestjs/common'
import { AuthGuard } from 'src/modules/auth/auth.guard'
import { AuthService } from 'src/modules/auth/auth.service'

@Module({
  imports: [],
  controllers: [],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard]
})
export class AuthModule {}
