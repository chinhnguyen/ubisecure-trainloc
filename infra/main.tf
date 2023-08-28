provider "aws" {
  region = "eu-west-1"
}

provider "archive" {}

locals {
  environment = terraform.workspace
  app_name    = "traintracker-${local.environment}"
}
