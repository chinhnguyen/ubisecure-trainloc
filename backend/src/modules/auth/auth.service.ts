import { Injectable, Logger } from '@nestjs/common'
import { CognitoJwtVerifier } from 'aws-jwt-verify'

import User from 'src/models/User'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  private readonly verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.AWS_COGNITO_ID,
    tokenUse: 'id',
    clientId: process.env.AWS_COGNITO_CLIENT_ID
  })

  async verifyUserByToken(token: string): Promise<User> {
    const {
      given_name: firstName,
      family_name: lastName,
      email,
      'cognito:username': username
    } = await this.verifier.verify(token)

    return {
      username,
      firstName,
      lastName,
      email
    } as User
  }
}
