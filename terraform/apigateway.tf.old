resource "aws_api_gateway_rest_api" "connect_admin" {
  api_key_source               = "HEADER"
  description                  = "Admin API"
  disable_execute_api_endpoint = "false"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
  name = "Admin"
}

resource "aws_api_gateway_rest_api_policy" "connect_admin" {
  rest_api_id = aws_api_gateway_rest_api.connect_admin.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Principal = "*",
        Action    = "execute-api:Invoke",
        Effect    = "Allow",
        Resource  = "arn:aws:execute-api:ap-southeast-1:${var.environment.account_id}:*/*"
      }
    ]
  })
}

resource "aws_api_gateway_method" "connect_admin_options" {
  api_key_required = "false"
  authorization    = "NONE"
  http_method      = "OPTIONS"
  resource_id      = aws_api_gateway_resource.connect_admin.id
  rest_api_id      = aws_api_gateway_rest_api.connect_admin.id
}

resource "aws_api_gateway_method" "connect_admin_post" {
  api_key_required = "false"
  authorization    = "NONE"
  http_method      = "POST"
  resource_id      = aws_api_gateway_resource.connect_admin.id
  rest_api_id      = aws_api_gateway_rest_api.connect_admin.id
}

resource "aws_api_gateway_method_response" "connect_admin_options" {
  http_method = "OPTIONS"
  resource_id = aws_api_gateway_resource.connect_admin.id
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "false"
    "method.response.header.Access-Control-Allow-Methods" = "false"
    "method.response.header.Access-Control-Allow-Origin"  = "false"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_admin.id
  status_code = "200"
}

resource "aws_api_gateway_method_response" "connect_admin_post" {
  http_method = "POST"
  resource_id = aws_api_gateway_resource.connect_admin.id
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "false"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_admin.id
  status_code = "200"
}

resource "aws_api_gateway_resource" "connect_admin" {
  parent_id   = aws_api_gateway_rest_api.connect_admin.root_resource_id
  path_part   = "tools"
  rest_api_id = aws_api_gateway_rest_api.connect_admin.id
}

resource "aws_api_gateway_integration" "connect_admin_options" {
  cache_namespace      = aws_api_gateway_resource.connect_admin.id
  connection_type      = "INTERNET"
  http_method          = "OPTIONS"
  passthrough_behavior = "WHEN_NO_MATCH"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
  resource_id          = aws_api_gateway_resource.connect_admin.id
  rest_api_id          = aws_api_gateway_rest_api.connect_admin.id
  timeout_milliseconds = "29000"
  type                 = "MOCK"
}

resource "aws_api_gateway_integration" "connect_admin_post" {
  cache_namespace         = aws_api_gateway_resource.connect_admin.id
  connection_type         = "INTERNET"
  content_handling        = "CONVERT_TO_TEXT"
  http_method             = "POST"
  integration_http_method = "POST"
  passthrough_behavior    = "WHEN_NO_MATCH"
  resource_id             = aws_api_gateway_resource.connect_admin.id
  rest_api_id             = aws_api_gateway_rest_api.connect_admin.id
  timeout_milliseconds    = "29000"
  type                    = "AWS"
  uri                     = "arn:aws:apigateway:ap-southeast-1:lambda:path/2015-03-31/functions/arn:aws:lambda:ap-southeast-1:851725611415:function:admin/invocations"
}

resource "aws_api_gateway_integration_response" "connect_admin_options" {
  http_method = "OPTIONS"
  resource_id = aws_api_gateway_resource.connect_admin.id
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_admin.id
  status_code = "200"
}

resource "aws_api_gateway_integration_response" "connect_admin_post" {
  depends_on  = [aws_api_gateway_resource.connect_admin]
  http_method = "POST"
  resource_id = aws_api_gateway_resource.connect_admin.id
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_admin.id
  status_code = "200"
}

resource "aws_api_gateway_deployment" "call_service_api_deployment" {
  depends_on  = [aws_api_gateway_integration.connect_admin_options, aws_api_gateway_integration.connect_admin_post]
  rest_api_id = aws_api_gateway_rest_api.connect_admin.id
}

resource "aws_api_gateway_stage" "connect_admin" {
  cache_cluster_enabled = "false"
  deployment_id         = aws_api_gateway_deployment.call_service_api_deployment.id
  rest_api_id           = aws_api_gateway_rest_api.connect_admin.id
  stage_name            = "connect-admin"
  xray_tracing_enabled  = "false"
}

resource "aws_lambda_permission" "connect_admin" {
  statement_id  = "AllowAPIGatewayInvoke_Connect_Admin"
  action        = "lambda:InvokeFunction"
  function_name = "admin"
  principal     = "apigateway.amazonaws.com" # For API Gateway
  # Define the source ARN for your API Gateway
  source_arn = "${aws_api_gateway_rest_api.connect_admin.execution_arn}/*/*/*"
}

resource "aws_api_gateway_gateway_response" "connect_admin_4xx" {
  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "gatewayresponse.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST'"
    "gatewayresponse.header.Access-Control-Allow-Origin"  = "'*'"
  }

  response_templates = {
    "application/json" = "{\"message\":$context.error.messageString}"
  }

  response_type = "DEFAULT_4XX"
  rest_api_id   = aws_api_gateway_rest_api.connect_admin.id
}

resource "aws_api_gateway_gateway_response" "connect_admin_5xx" {
  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "gatewayresponse.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST'"
    "gatewayresponse.header.Access-Control-Allow-Origin"  = "'*'"
  }

  response_templates = {
    "application/json" = "{\"message\":$context.error.messageString}"
  }

  response_type = "DEFAULT_5XX"
  rest_api_id   = aws_api_gateway_rest_api.connect_admin.id
}
