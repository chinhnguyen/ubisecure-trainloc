import { Module } from '@nestjs/common'
import { TrainsController } from './trains.controller'
import { CommModule } from 'src/modules/comm/comm.module'
import { AuthModule } from 'src/modules/auth/auth.module'

@Module({
  imports: [AuthModule, CommModule],
  controllers: [TrainsController],
  providers: []
})
export class TrainsModule {}
