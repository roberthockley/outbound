resource "aws_cloudwatch_log_group" "lambda_outbound" {
  name              = "/aws/lambda/${aws_lambda_function.lambda_outbound.function_name}"
  retention_in_days = 7
}

resource "aws_lambda_layer_version" "lambda_layer_dynamodb" {
  filename            = "dynamodb_layer.zip"
  layer_name          = "dynamodb"
  description         = "^3.744.0"
  compatible_runtimes = ["nodejs22.x"]
}

resource "aws_lambda_layer_version" "lambda_layer_eventbridge" {
  filename            = "eventbridge_lambda_layer.zip"
  layer_name          = "eventbridge_lambda"
  description         = "^3.744.0"
  compatible_runtimes = ["nodejs22.x"]
}

resource "aws_lambda_function" "lambda_makeCampaign" {
  # If the file is not in the current working directory you will need to include a
  # path.module in the filename.
  filename      = "outbound_makeCamapign.zip"
  function_name = "outbound-makeContactsTable"
  description   = "Lambda to make dedicated DynamoDB table for campaign"
  role          = aws_iam_role.RoleForDynamoDB.arn
  handler       = "index.handler"
  publish       = true
  layers        = [aws_lambda_layer_version.lambda_layer_dynamodb.arn, aws_lambda_layer_version.lambda_layer_eventbridge.arn]
  runtime       = "nodejs22.x"
  memory_size   = "128"
  timeout       = "30"
  ephemeral_storage {
    size = 512 # Min 512 MB and the Max 10240 MB
  }
  environment {
    variables = {
      readCampaignFunctionARN  = ""
      readCampaignFunctionName = ""
      roleARN                  = aws_iam_role.RoleForDynamoDB.arn
    }
  }
}
