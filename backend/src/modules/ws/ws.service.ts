import {
  ApiGatewayManagementApiClient,
  GetConnectionCommand,
  PostToConnectionCommand
} from '@aws-sdk/client-apigatewaymanagementapi'
import {
  DeleteItemCommand,
  DynamoDBClient,
  QueryCommand,
  ScanCommand
} from '@aws-sdk/client-dynamodb'
import { Injectable, Logger } from '@nestjs/common'
import { CognitoJwtVerifier } from 'aws-jwt-verify'
import TrainLocation from 'src/models/TrainLocation'

@Injectable()
export class WebSocketService {
  private readonly logger = new Logger(WebSocketService.name)
  private readonly wsClient = new ApiGatewayManagementApiClient({
    endpoint: process.env.AWS_WS_CONNECTION_URL
  })
  private readonly dynaoDBClient = new DynamoDBClient({
    region: process.env.AWS_DYNAMODB_REGION
  })

  async publishTrainLocation(
    trainNumber: number,
    trainLocation: TrainLocation
  ): Promise<void> {
    const message = JSON.stringify({ ...trainLocation, trainNumber })
    this.logger.debug(`Publishing '${message}' ...`)
    const scanCommand = new ScanCommand({
      TableName: process.env.AWS_DYNAMODB_TABLE
    })
    const queryResult = await this.dynaoDBClient.send(scanCommand)
    const connections = queryResult.Items.map((item) => item.connectionId.S)
    this.logger.debug(`Found ${connections.length} connections.`)
    for (const connectionId of connections) {
      const sendMessageCmd = new PostToConnectionCommand({
        ConnectionId: connectionId,
        Data: message
      })
      try {
        await this.wsClient.send(sendMessageCmd)
      } catch (error) {
        if (error.statusCode === 410) {
          // Remove stale connection
          const deleteCommand = new DeleteItemCommand({
            TableName: process.env.AWS_DYNAMODB_TABLE,
            Key: { connectionId: { S: connectionId } }
          })
          await this.dynaoDBClient.send(deleteCommand)
        } else {
          this.logger.error(
            'Error while sending message to connection',
            connectionId,
            error
          )
        }
      }
    }
  }
}
