import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { AuthModule } from 'src/modules/auth/auth.module'

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: []
})
export class UsersModule {}
