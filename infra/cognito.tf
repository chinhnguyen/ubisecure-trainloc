resource "aws_cognito_user_pool" "user_pool" {
  name = "${local.app_name}-users"
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
    recovery_mechanism {
      name     = "verified_phone_number"
      priority = 2
    }
  }
 
  auto_verified_attributes = ["email"]
}

resource "aws_cognito_user_pool_client" "webapp_client" {
  name            = "${local.app_name}-webapp-client"
  user_pool_id    = aws_cognito_user_pool.user_pool.id
  generate_secret = false
  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]
  supported_identity_providers = ["COGNITO"]
}
