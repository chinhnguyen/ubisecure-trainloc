import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { Request } from 'express'
import User from 'src/models/User'
import { AuthGuard } from 'src/modules/auth/auth.guard'
import { AuthService } from 'src/modules/auth/auth.service'

@Controller({
  path: '/users',
  version: '1'
})
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly cognitoService: AuthService) {}

  @Get('/current')
  getCurrentUser(@Req() request: Request): User {
    return request['user'] as User
  }
}
