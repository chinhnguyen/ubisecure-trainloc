import { AuthService } from 'src/modules/auth/auth.service'
import { CognitoJwtVerifier } from 'aws-jwt-verify'
import { Permission } from './permission'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from './auth.guard'
import { ExecutionContext, UnauthorizedException } from '@nestjs/common'

describe('AuthGuard', () => {
  describe('canActivate', () => {
    jest.spyOn(CognitoJwtVerifier, 'create').mockReturnValue({} as any)
    const authService = new AuthService()

    const reflector = new Reflector()
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([])

    const baseContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer anyToken'
          }
        })
      }),
      getHandler: () => {},
      getClass: () => {}
    } as ExecutionContext

    const authGuard = new AuthGuard(reflector, authService)

    it('should throw UnauthorizedException if token is not provided', () => {
      jest
        .spyOn(authService, 'authUser')
        .mockRejectedValue(new Error('anyError'))
      const context = {
        ...baseContext,
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {}
          })
        })
      } as ExecutionContext
      expect(authGuard.canActivate(context)).rejects.toThrowError(
        UnauthorizedException
      )
    })

    it('should throw UnauthorizedException if token could not be verified', () => {
      jest
        .spyOn(authService, 'authUser')
        .mockRejectedValue(new Error('anyError'))
      expect(authGuard.canActivate({ ...baseContext })).rejects.toThrowError(
        UnauthorizedException
      )
    })

    it('should set user on request if token could be verified', async () => {
      const user = {
        id: 'anyId',
        username: 'anyUsername',
        firstName: 'anyFirstName',
        lastName: 'anyLastName',
        email: 'anyEmail'
      }
      jest.spyOn(authService, 'authUser').mockResolvedValue(user)

      const request = {}
      const context = {
        ...baseContext,
        switchToHttp: () => ({
          getRequest: () => request
        })
      } as ExecutionContext
      await authGuard.canActivate(context)
      expect(request['user']).toEqual(user)
    })
  })
})
