import { Module } from '@nestjs/common'
import { WebSocketService } from 'src/modules/ws/ws.service'

@Module({
  imports: [],
  controllers: [],
  providers: [WebSocketService],
  exports: [WebSocketService]
})
export class WebSocketModule {}
