import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { Request } from 'express'
import User from 'src/models/User'
import { AuthGuard } from 'src/modules/cognito/auth.guard'

@Controller({
  path: '/users',
  version: '1'
})
@UseGuards(AuthGuard)
export class UsersController {
  @Get('/current')
  getCurrentUser(@Req() request: Request): User {
    return request['user']
  }
}
