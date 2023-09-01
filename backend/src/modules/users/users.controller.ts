import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common'
import { Request } from 'express'
import User from 'src/dtos/User'
import { AuthGuard } from 'src/modules/auth/auth.guard'
import { AuthService } from 'src/modules/auth/auth.service'
import { EmailService } from '../comm/email.service'

@Controller({
  path: '/users',
  version: '1'
})
@UseGuards(AuthGuard)
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService
  ) {}

  @Get('/current')
  getCurrentUser(@Req() request: Request): User {
    return request['user'] as User
  }

  @Post('/current/invites')
  inviteUser(@Body('email') email: string): Promise<void> {
    if (!email || email.length === 0) throw new BadRequestException()
    return this.emailService.sendInvitation(email)
  }
}
