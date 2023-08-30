resource "aws_dynamodb_table" "ws_api_clients_table" {
  name           = "${local.app_name}-ws-clients"
  billing_mode   = "PROVISIONED"
  read_capacity  = "30"
  write_capacity = "30"
  hash_key       = "connectionId"

  attribute {
    name = "connectionId"
    type = "S"
  }
  ttl {
    attribute_name = "expiresAt"
    enabled        = true
  }
}

data "archive_file" "ws_api_zip" {
  type        = "zip"
  source_file = "${path.module}/../wsapi/dist/index.js"
  output_path = "wsapi.zip"
}

data "aws_iam_policy_document" "ws_api_lambda_ipd" {
  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    effect    = "Allow"
    resources = ["arn:aws:logs:*:*:*"]
  }

  statement {
    actions = [
      "execute-api:ManageConnections",
    ]
    effect    = "Allow"
    resources = ["arn:aws:execute-api:*:*:*"]
  }

  statement {
    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:DeleteItem",
    ]
    effect    = "Allow"
    resources = [aws_dynamodb_table.ws_api_clients_table.arn]
  }
}

resource "aws_iam_policy" "ws_api_lambda_policy" {
  name   = "${local.app_name}-api-lambda-policy"
  path   = "/"
  policy = data.aws_iam_policy_document.ws_api_lambda_ipd.json
}

resource "aws_iam_role" "ws_api_lambda_role" {
  name = "${local.app_name}-api-lambda-role"
  assume_role_policy = jsonencode(
    {
      Version = "2012-10-17"
      Statement = [
        {
          Action = "sts:AssumeRole"
          Principal = {
            Service = "lambda.amazonaws.com"
          }
          Effect = "Allow"
        }
      ]
    }
  )
}

resource "aws_iam_role_policy_attachment" "ws_api_lambda_rpa" {
  role       = aws_iam_role.ws_api_lambda_role.name
  policy_arn = aws_iam_policy.ws_api_lambda_policy.arn
}

resource "aws_lambda_function" "ws_api_lambda_fn" {
  filename         = data.archive_file.ws_api_zip.output_path
  function_name    = "${local.app_name}-api-lambda"
  role             = aws_iam_role.ws_api_lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs16.x"
  source_code_hash = data.archive_file.ws_api_zip.output_base64sha256

  environment {
    variables = {
      AWS_TABLE_REGION = data.aws_region.current.name
      AWS_TABLE_NAME   = aws_dynamodb_table.ws_api_clients_table.name
    }
  }
}

resource "aws_cloudwatch_log_group" "ws_api_lambda_logs" {
  name              = "/aws/lambda/${aws_lambda_function.ws_api_lambda_fn.function_name}"
  retention_in_days = 30
}

data "aws_iam_policy_document" "ws_api_ipd" {
  statement {
    actions = [
      "lambda:InvokeFunction",
    ]
    effect    = "Allow"
    resources = [aws_lambda_function.ws_api_lambda_fn.arn]
  }
}

resource "aws_iam_policy" "ws_api_policy" {
  name   = "${local.app_name}-api-policy"
  path   = "/"
  policy = data.aws_iam_policy_document.ws_api_ipd.json
}

resource "aws_iam_role" "ws_api_role" {
  name = "${local.app_name}-api-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "apigateway.amazonaws.com"
        }
      },
    ]
  })

  managed_policy_arns = [aws_iam_policy.ws_api_policy.arn]
}

resource "aws_apigatewayv2_api" "ws_api" {
  name                       = "${local.app_name}-ws"
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"
}

resource "aws_apigatewayv2_stage" "ws_api_stage" {
  api_id      = aws_apigatewayv2_api.ws_api.id
  name        = "v1"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "ws_api_itg" {
  api_id                    = aws_apigatewayv2_api.ws_api.id
  integration_type          = "AWS_PROXY"
  integration_uri           = aws_lambda_function.ws_api_lambda_fn.invoke_arn
  credentials_arn           = aws_iam_role.ws_api_role.arn
  content_handling_strategy = "CONVERT_TO_TEXT"
  passthrough_behavior      = "WHEN_NO_MATCH"
}

resource "aws_apigatewayv2_integration_response" "ws_api_itg_res" {
  api_id                   = aws_apigatewayv2_api.ws_api.id
  integration_id           = aws_apigatewayv2_integration.ws_api_itg.id
  integration_response_key = "/200/"
}

resource "aws_apigatewayv2_route" "ws_api_default_route" {
  api_id    = aws_apigatewayv2_api.ws_api.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.ws_api_itg.id}"
}

resource "aws_apigatewayv2_route_response" "ws_api_default_route_res" {
  api_id             = aws_apigatewayv2_api.ws_api.id
  route_id           = aws_apigatewayv2_route.ws_api_default_route.id
  route_response_key = "$default"
}

resource "aws_apigatewayv2_route" "ws_api_connect_route" {
  api_id    = aws_apigatewayv2_api.ws_api.id
  route_key = "$connect"
  target    = "integrations/${aws_apigatewayv2_integration.ws_api_itg.id}"
}

resource "aws_apigatewayv2_route_response" "ws_api_connect_route_res" {
  api_id             = aws_apigatewayv2_api.ws_api.id
  route_id           = aws_apigatewayv2_route.ws_api_connect_route.id
  route_response_key = "$default"
}

resource "aws_apigatewayv2_route" "ws_api_disconnect_route" {
  api_id    = aws_apigatewayv2_api.ws_api.id
  route_key = "$disconnect"
  target    = "integrations/${aws_apigatewayv2_integration.ws_api_itg.id}"
}

resource "aws_apigatewayv2_route_response" "ws_api_disconnect_route_res" {
  api_id             = aws_apigatewayv2_api.ws_api.id
  route_id           = aws_apigatewayv2_route.ws_api_disconnect_route.id
  route_response_key = "$default"
}

resource "aws_lambda_permission" "ws_api_invoke_lambda_permissions" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ws_api_lambda_fn.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.ws_api.execution_arn}/*/*"
}
