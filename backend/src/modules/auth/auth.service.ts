import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { CognitoJwtVerifier } from 'aws-jwt-verify'

import User from 'src/dtos/User'
import { Permission } from 'src/modules/auth/permission'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  private readonly verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.AWS_COGNITO_ID,
    tokenUse: 'id',
    clientId: process.env.AWS_COGNITO_CLIENT_ID
  })

  async authUser(
    token: string,
    requiredPermissions: Array<Permission>
  ): Promise<User> {
    const user = await this.verifier.verify(token)
    const {
      sub: id,
      given_name: firstName,
      family_name: lastName,
      email,
      'cognito:username': username
    } = user
    const permissions = (user['custom:permissions'] as Permission[]) ?? []
    if (
      requiredPermissions.length > 0 &&
      requiredPermissions.some((p) => !permissions.includes(p))
    ) {
      throw new UnauthorizedException('Missing required permissions')
    }

    return {
      id,
      username,
      firstName,
      lastName,
      email
    } as User
  }
}
