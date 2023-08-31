import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { AuthService } from 'src/modules/auth/auth.service'
import { Permission } from 'src/modules/auth/permission'
import { REQUIRED_PERMISSIONS_KEY } from 'src/modules/auth/permissions.decorator'

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name)

  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException()
    }
    try {
      const requiredPermissions =
        this.reflector.getAllAndOverride<Permission[]>(
          REQUIRED_PERMISSIONS_KEY,
          [context.getHandler(), context.getClass()]
        ) ?? []

      const user = await this.authService.authUser(token, requiredPermissions)
      if (!user) {
        throw new UnauthorizedException()
      }
      request['user'] = user
      return true
    } catch (e) {
      this.logger.error(e)
      throw new UnauthorizedException()
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
