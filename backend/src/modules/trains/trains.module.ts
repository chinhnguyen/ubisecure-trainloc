import { Module } from '@nestjs/common'
import { TrainsController } from './trains.controller'
import { WebSocketModule } from 'src/modules/ws/ws.module'

@Module({
  imports: [WebSocketModule],
  controllers: [TrainsController],
  providers: []
})
export class TrainsModule {}
