import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { AuthModule } from 'src/modules/auth/auth.module'
import { CommModule } from '../comm/comm.module'

@Module({
  imports: [AuthModule, CommModule],
  controllers: [UsersController],
  providers: []
})
export class UsersModule {}
