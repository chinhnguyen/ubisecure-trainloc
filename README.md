# Train Tracker

Sample project to demo latest development stacks. The idea is to build a live train location updates.

## Development Stacks

Below techniques are being used for development:

1. [NestJS](https://nestjs.com/) for backend/RestAPI development.
1. [ReactJS](https://react.dev/) for frontend development in which:
1. [ReduxJS](https://redux.js.org/) is used for state management.
1. [Redux Toolkit Query](https://redux-toolkit.js.org/rtk-query/overview) is used for calling RestApi.
1. [AWS WebSocket API](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api.html) is used for handling live update of train feeds.
1. [AWS Lambda](https://aws.amazon.com/lambda/) is used for backed WebSocket API to live update related logic.
1. [AWS DynamoDB](https://aws.amazon.com/dynamodb/) is used for storing clients' connections.
1. [AWS Cognito](https://aws.amazon.com/cognito/) is for managing user signin, signup experiences.
1. [AWS SES](https://aws.amazon.com/ses/) is for sending invitation emails.
1. [Terraform](https://www.terraform.io/) is for cloud infrastucture development.
1. Google Map is used for displaying train locations.
1. TypeScript is the main development language.

## Features

1. Users can signup with email, username, first name and last name
1. After verifying their emails, users then can signin and start using the app.
1. Users can update their personal info including first name, last name, email but not username. Updating email will require user to verify their email again.
1. Users can view VR's train info in either table view or map view.
1. Users can invite other users by sending invitation to an email address.
1. Users can optionally be allowed to access the updating train locations endpoint.
1. [VR's trains info](<https://rata.digitraffic.fi/api/v2/graphql/graphiql?query=%7B%0A%20%20currentlyRunningTrains(where%3A%20%7Boperator%3A%20%7BshortCode%3A%20%7Bequals%3A%20%22vr%22%7D%7D%7D)%20%7B%0A%20%20%20%20trainNumber%0A%20%20%20%20departureDate%0A%20%20%20%20trainLocations(where%3A%20%7Bspeed%3A%20%7BgreaterThan%3A%2030%7D%7D%2C%20orderBy%3A%20%7Btimestamp%3A%20DESCENDING%7D%2C%20take%3A%201)%20%7B%0A%20%20%20%20%20%20speed%0A%20%20%20%20%20%20timestamp%0A%20%20%20%20%20%20location%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D>) can be read and fed into out system using `feeder` sample app.

## Development components

To get the app funtion properly there are 5 components have been developed.

1. `/backend`: serve data to FrontEnd and train locations feeder apps. Code can be found under
1. `/frontend`: user front facing app.
1. `/infra`: terraform scripts for setting up infrastucture
1. `/wsapi`: lambda function to handle users' WebSocket connections
1. `/feeder`: a sample partner application that read VR's train info and feed into the app using a credentials with needed permisisons.

## How to start developing?

1. Pull the source
1. Create an AWS development account with below permissions. NOTE: this account is supposed to be used for deployment as well, and thus it is powerful. So keep if safe and DO NOT use it as runtime credetial.

```
AmazonAPIGatewayAdministrator
AmazonAPIGatewayInvokeFullAccess
AmazonCognitoPowerUser
AmazonDynamoDBFullAccess
AmazonS3FullAccess
AmazonSESFullAccess
AWSLambda_FullAccess
CloudWatchLogsFullAccess
IAMFullAccess
```

1. Run `aws configure` to setup the dev account

1. Backend `.env` need to be created with below values

```
AWS_COGNITO_REGION=
AWS_COGNITO_ID=
AWS_COGNITO_CLIENT_ID=

AWS_DYNAMODB_REGION=
AWS_DYNAMODB_TABLE=

AWS_WS_CONNECTION_URL=

AWS_SES_REGION=
AWS_SES_FROM_EMAIL=

SIGNUP_BASE_URL=
```

1. Backend `.env` need to be created with below values

```
REACT_APP_AWS_COGNITO_ID=
REACT_APP_AWS_COGNITO_CLIENT_ID=

REACT_APP_API_BASE_URL=
REACT_APP_WS_URL=

REACT_APP_GOOGLE_MAP_API_KEY=
```

1. Open `ubisecure.code-workspace`

## Limitations

1. Invitations can now only work with manually verified emails cause the SES account need to be verified at domain level and moved out of sandbox.
1. Frontend and Backend are in development mode, there is no live demo yet.

## Todos

1. Deployment strategy for Frontend and Backend. Possible ideas include Route53, CloudFront, S3 for Frontend and API Gateway, Lambda for Backend.
1. Security enhancement for Google Maps API Key by adding accepted domains.
1. Security enhancement for WSS endpoint by adding [WAF](https://aws.amazon.com/waf/).
1. Security enhancement for WSS by asking clients to send id token for verification.
