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
}
