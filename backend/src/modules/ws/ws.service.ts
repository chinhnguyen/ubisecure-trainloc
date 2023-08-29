import {
  ApiGatewayManagementApiClient,
  GetConnectionCommand,
  PostToConnectionCommand
} from '@aws-sdk/client-apigatewaymanagementapi'
import { Injectable, Logger } from '@nestjs/common'
import { CognitoJwtVerifier } from 'aws-jwt-verify'
import TrainLocation from 'src/models/TrainLocation'

@Injectable()
export class WebSocketService {
  private readonly logger = new Logger(WebSocketService.name)
  private readonly wsClient = new ApiGatewayManagementApiClient({
    endpoint: process.env.AWS_WS_CONNECTION_URL
  })

  async publishTrainLocation(
    trainNumber: number,
    trainLocation: TrainLocation
  ): Promise<void> {
    // try {
    //   new GetConnectionCommand({  })
    //   const message = JSON.stringify({ ...trainLocation, trainNumber })
    //   this.logger.debug(`Sending '${message}' ...`)
    //   const postToConnParams = {
    //     Data: message
    //   }
    //   const postToConnCmd = new PostToConnectionCommand(postToConnParams)
    //   await this.wsClient.send(postToConnCmd)
    //   console.debug(
    //     `[ClientMgr] Message '${theMessage}' was sent to ${connectionId}.`
    //   )
    // } catch (err) {
    //   console.error(
    //     `[ClientMgr] Error sending message '${theMessage}' to ${connectionId}. Error: ${err}`
    //   )
    // }
  }
}
