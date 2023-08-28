import '@aws-amplify/ui-react/styles.css'
import { Amplify } from 'aws-amplify'

Amplify.configure({
  Auth: {
    userPoolId: process.env.REACT_APP_AWS_COGNITO_ID,
    userPoolWebClientId: process.env.REACT_APP_AWS_COGNITO_CLIENT_ID
  }
})
