import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Test } from '@nestjs/testing'
import { CognitoJwtVerifier } from 'aws-jwt-verify'
import { AuthGuard } from 'src/modules/auth/auth.guard'
import { AuthService } from 'src/modules/auth/auth.service'
import { Permission } from './permission'

describe('AuthGuard.integration', () => {
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

  describe('canActivate', () => {
    it('should throw UnauthorizedException if token could not be verified', async () => {
      jest.spyOn(CognitoJwtVerifier, 'create').mockReturnValue({
        verify: () => Promise.reject(new Error('anyError'))
      } as any)

      const moduleRef = await Test.createTestingModule({
        controllers: [],
        providers: [AuthGuard, AuthService]
      }).compile()
      const authGuard = moduleRef.get<AuthGuard>(AuthGuard)
      const reflector = moduleRef.get<Reflector>(Reflector)
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([])

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

    it('should set user on request if token could be verified', async () => {
      jest.spyOn(CognitoJwtVerifier, 'create').mockReturnValue({
        verify: () =>
          Promise.resolve({
            sub: 'anyId',
            given_name: 'anyFirstName',
            family_name: 'anyLastName',
            email: 'anyEmail',
            'cognito:username': 'anyUsername',
            'custom:permissions': [Permission.PUT_TRAIN_LOCATION]
          })
      } as any)

      const moduleRef = await Test.createTestingModule({
        controllers: [],
        providers: [AuthGuard, AuthService]
      }).compile()
      const authGuard = moduleRef.get<AuthGuard>(AuthGuard)
      const reflector = moduleRef.get<Reflector>(Reflector)
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([])

      const request = {}
      const context = {
        ...baseContext,
        switchToHttp: () => ({
          getRequest: () => request
        })
      } as ExecutionContext
      await authGuard.canActivate(context)
      expect(request['user']).toEqual({
        id: 'anyId',
        username: 'anyUsername',
        firstName: 'anyFirstName',
        lastName: 'anyLastName',
        email: 'anyEmail'
      })
    })
  })
})
