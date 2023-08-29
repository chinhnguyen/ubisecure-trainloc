import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  Res,
  UseGuards
} from '@nestjs/common'
import { Request } from 'express'
import TrainLocation from 'src/models/TrainLocation'
import User from 'src/models/User'
import { AuthGuard } from 'src/modules/cognito/auth.guard'
import { CognitoService } from 'src/modules/cognito/cognito.service'
import { WebSocketService } from 'src/modules/ws/ws.service'

@Controller({
  path: '/trains',
  version: '1'
})
export class TrainsController {
  constructor(private readonly wsService: WebSocketService) {}

  @Put('/:id/location')
  async putLocation(
    @Param('id') trainNumber: number,
    @Body() trainLocation: TrainLocation
  ): Promise<void> {
    await this.wsService.publishTrainLocation(trainNumber, trainLocation)
  }
}
