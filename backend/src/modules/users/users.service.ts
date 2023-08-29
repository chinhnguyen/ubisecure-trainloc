import { Injectable } from '@nestjs/common'

@Injectable()
export class UsersService {
  loadCurrentUser(): string {
    return 'Hello World!'
  }
}
