import { AuthService } from 'src/modules/auth/auth.service'
import { CognitoJwtVerifier } from 'aws-jwt-verify'
import { Permission } from './permission'

describe('AuthService', () => {
  describe('authUser', () => {
    it('should throw error if token could not be verified', () => {
      jest.spyOn(CognitoJwtVerifier, 'create').mockReturnValue({
        verify: () => Promise.reject(new Error('anyError'))
      } as any)
      const authService = new AuthService()
      expect(authService.authUser('', [])).rejects.toThrowError('anyError')
    })

    it('should throw error if user does not have required permissions', () => {
      jest.spyOn(CognitoJwtVerifier, 'create').mockReturnValue({
        verify: () =>
          Promise.resolve({
            'custom:permissions': []
          })
      } as any)
      const authService = new AuthService()
      expect(
        authService.authUser('', [Permission.PUT_TRAIN_LOCATION])
      ).rejects.toThrowError('Missing required permissions')
    })

    it('should return user if token is valid and user has required permissions', async () => {
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
      const authService = new AuthService()
      const user = await authService.authUser('', [
        Permission.PUT_TRAIN_LOCATION
      ])
      expect(user).toEqual({
        id: 'anyId',
        username: 'anyUsername',
        firstName: 'anyFirstName',
        lastName: 'anyLastName',
        email: 'anyEmail'
      })
    })
  })
})
