import { Module } from '@nestjs/common'
import { AuthGuard } from 'src/modules/cognito/auth.guard'
import { CognitoService } from 'src/modules/cognito/cognito.service'

@Module({
  imports: [],
  controllers: [],
  providers: [CognitoService, AuthGuard],
  exports: [CognitoService, AuthGuard]
})
export class CognitoModule {}
