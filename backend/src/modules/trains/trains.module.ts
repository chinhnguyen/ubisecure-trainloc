import { Module } from '@nestjs/common'
import { TrainsController } from './trains.controller'
import { WebSocketModule } from 'src/modules/ws/ws.module'
import { AuthModule } from 'src/modules/auth/auth.module'

@Module({
  imports: [AuthModule, WebSocketModule],
  controllers: [TrainsController],
  providers: []
})
export class TrainsModule {}
