import { Injectable } from '@nestjs/common'
import User from 'src/models/User'

@Injectable()
export class CognitoService {
  async loadUserByToken(token: string): Promise<User> {
    return {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@gmail.com'
    }
  }
}
