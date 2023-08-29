import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { CognitoModule } from 'src/modules/cognito/cognito.module'

@Module({
  imports: [CognitoModule],
  controllers: [UsersController],
  providers: []
})
export class UsersModule {}
