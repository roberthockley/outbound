resource "aws_cloudwatch_log_group" "lambda_outbound" {
  name              = "/aws/lambda/${aws_lambda_function.lambda_outbound.function_name}"
  retention_in_days = 7
}

resource "aws_lambda_layer_version" "lambda_layer_dynamodb" {
  filename            = "dynamodb_layer.zip"
  layer_name          = "connect"
  description         = "^3.744.0"
  compatible_runtimes = ["nodejs22.x"]
}

resource "aws_lambda_function" "lambda_outbound" {
  # If the file is not in the current working directory you will need to include a
  # path.module in the filename.
  filename      = "outbound_dynamo.zip"
  function_name = "outbound-dynamo"
  role          = aws_iam_role.RoleForDynamoDB.arn
  handler       = "index.handler"
  publish       = true
  layers        = [aws_lambda_layer_version.lambda_layer_dynamodb.arn]
  runtime       = "nodejs22.x"
  memory_size   = "128"
  timeout       = "30"
  ephemeral_storage {
    size = 512 # Min 512 MB and the Max 10240 MB
  }
  environment {
    variables = {
    }
  }
}
