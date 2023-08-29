import { Controller, Get } from '@nestjs/common'
import { UsersService } from './users.service'
import { version } from 'os'

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/current')
  getCurrentUser(): string {
    return this.usersService.loadCurrentUser()
  }
}
