import { SetMetadata } from '@nestjs/common'
import { Permission } from 'src/modules/auth/permission'

export const REQUIRED_PERMISSIONS_KEY = 'required-permissions'
export const RequiredPermissions = (...permissions: Permission[]) =>
  SetMetadata(REQUIRED_PERMISSIONS_KEY, permissions)
