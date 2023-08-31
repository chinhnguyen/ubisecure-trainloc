import { Body, Controller, Param, Put } from '@nestjs/common'
import TrainLocation from 'src/models/TrainLocation'
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
    console.log(trainLocation)
    // TODO: This is for demo purpose only. In reality when number connections are too many,
    // sending and wait here will timeout the request. We should use a queue system to handle
    // the sending of messages.
    // There is also another choice to batch the changes and send them in one message to avoid 
    // flooding the network.
    await this.wsService.publishTrainLocation(trainNumber, trainLocation)
  }
}
