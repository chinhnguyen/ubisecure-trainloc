import { Module } from '@nestjs/common'
import { WebSocketService } from 'src/modules/comm/ws.service'
import { EmailService } from './email.service'

@Module({
  imports: [],
  controllers: [],
  providers: [WebSocketService, EmailService],
  exports: [WebSocketService, EmailService]
})
export class CommModule {}
