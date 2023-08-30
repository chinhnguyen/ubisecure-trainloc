import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda'
import {
  DynamoDBClient,
  PutItemCommand,
  DeleteItemCommand
} from '@aws-sdk/client-dynamodb'

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_TABLE_REGION
})
const tableName = process.env.AWS_TABLE_NAME

export const handler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  const { routeKey, connectionId } = event.requestContext
  console.log(`Route key: ${routeKey}`)
  console.log(`Connection ID: ${connectionId}`)
  if (routeKey === '$connect') {
    const secondsSinceEpoch = Math.round(Date.now() / 1000)
    const expiresAt = secondsSinceEpoch + 3600 * 24 // 1 day
    const putParams = {
      TableName: tableName,
      Item: {
        connectionId: { S: connectionId },
        expiresAt: { N: `${expiresAt}` }
      }
    }
    const putItemCmd = new PutItemCommand(putParams)
    try {
      await dynamoDBClient.send(putItemCmd)
      console.log(`Connection ${connectionId} saved.`)
    } catch (error) {
      console.error('Error saving connection', error)
    }
  } else if (routeKey === '$disconnect') {
    const deleteParams = {
      TableName: tableName,
      Key: { connectionId: { S: connectionId } }
    }
    const deleteItemCmd = new DeleteItemCommand(deleteParams)
    try {
      await dynamoDBClient.send(deleteItemCmd)
      console.log(`Connection ${connectionId} deleted.`)
    } catch (error) {
      console.error('Error deleting connection', error)
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      connectionId
    })
  }
}
