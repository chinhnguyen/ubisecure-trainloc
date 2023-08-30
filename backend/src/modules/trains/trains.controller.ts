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
    await this.wsService.publishTrainLocation(trainNumber, trainLocation)
  }
}
