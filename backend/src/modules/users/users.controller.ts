import { Controller, Get, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { AuthGuard } from 'src/modules/cognito/auth.guard'

@Controller({
  path: '/users',
  version: '1'
})
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/current')
  getCurrentUser(): string {
    return this.usersService.loadCurrentUser()
  }
}
