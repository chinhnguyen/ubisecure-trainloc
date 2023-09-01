import { useEffect, useState } from 'react'
import { Authenticator } from '@aws-amplify/ui-react'
import { Outlet, useSearchParams } from 'react-router-dom'
import './AuthContainer.scss'

const AuthContainer = () => {
  const [searchParams] = useSearchParams()
  const [initialState, setInitialState] = useState<'signIn' | 'signUp'>(
    'signIn'
  )
  const [formFields, setFormFields] = useState<any>({})

  useEffect(() => {
    if (searchParams.get('action') === 'signup') {
      setInitialState('signUp')
    }
    const email = searchParams.get('email')
    if (email && email.length > 0) {
      setFormFields({
        signUp: {
          email: {
            defaultValue: email
          }
        }
      })
    }
  }, [searchParams])

  return (
    <Authenticator
      signUpAttributes={['email']}
      loginMechanisms={['username']}
      initialState={initialState}
      formFields={formFields}
    >
      {() => (
        <Authenticator.Provider>
          <Outlet />
        </Authenticator.Provider>
      )}
    </Authenticator>
  )
}

export default AuthContainer
