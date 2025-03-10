resource "aws_api_gateway_rest_api" "connect_outbound" {
  api_key_source               = "HEADER"
  description                  = "Outbound Dialer API"
  disable_execute_api_endpoint = "false"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
  name = "Outbound"
}

resource "aws_api_gateway_rest_api_policy" "connect_outbound" {
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
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

resource "aws_api_gateway_resource" "connect_outbound_read" {
  parent_id   = aws_api_gateway_rest_api.connect_outbound.root_resource_id
  path_part   = "read"
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_api_gateway_resource" "connect_outbound_make" {
  parent_id   = aws_api_gateway_rest_api.connect_outbound.root_resource_id
  path_part   = "make"
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_api_gateway_method" "connect_outbound_read_options" {
  api_key_required = "false"
  authorization    = "NONE"
  http_method      = "OPTIONS"
  resource_id      = aws_api_gateway_resource.connect_outbound_read.id
  rest_api_id      = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_api_gateway_method" "connect_outbound_make_options" {
  api_key_required = "false"
  authorization    = "NONE"
  http_method      = "OPTIONS"
  resource_id      = aws_api_gateway_resource.connect_outbound_make.id
  rest_api_id      = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_api_gateway_method" "connect_outbound_read_post" {
  api_key_required = "false"
  authorization    = "NONE"
  http_method      = "POST"
  resource_id      = aws_api_gateway_resource.connect_outbound_read.id
  rest_api_id      = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_api_gateway_method" "connect_outbound_make_post" {
  api_key_required = "false"
  authorization    = "NONE"
  http_method      = "POST"
  resource_id      = aws_api_gateway_resource.connect_outbound_make.id
  rest_api_id      = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_api_gateway_method_response" "connect_outbound_read_options" {
  depends_on  = [aws_api_gateway_method.connect_outbound_read_options]
  http_method = "OPTIONS"
  resource_id = aws_api_gateway_resource.connect_outbound_read.id
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "false"
    "method.response.header.Access-Control-Allow-Methods" = "false"
    "method.response.header.Access-Control-Allow-Origin"  = "false"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
  status_code = "200"
}

resource "aws_api_gateway_method_response" "connect_outbound_make_options" {
  depends_on  = [aws_api_gateway_method.connect_outbound_make_options]
  http_method = "OPTIONS"
  resource_id = aws_api_gateway_resource.connect_outbound_make.id
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "false"
    "method.response.header.Access-Control-Allow-Methods" = "false"
    "method.response.header.Access-Control-Allow-Origin"  = "false"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
  status_code = "200"
}

resource "aws_api_gateway_method_response" "connect_outbound_read_post" {
  depends_on = [aws_api_gateway_method.connect_outbound_read_post]

  http_method = "POST"
  resource_id = aws_api_gateway_resource.connect_outbound_read.id
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "false"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
  status_code = "200"
}

resource "aws_api_gateway_method_response" "connect_outbound_make_post" {
  http_method = "POST"
  resource_id = aws_api_gateway_resource.connect_outbound_make.id
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "false"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
  status_code = "200"
}

resource "aws_api_gateway_integration" "connect_outbound_read_options" {
  depends_on           = [aws_api_gateway_method.connect_outbound_read_options]
  cache_namespace      = aws_api_gateway_resource.connect_outbound_read.id
  connection_type      = "INTERNET"
  http_method          = "OPTIONS"
  passthrough_behavior = "WHEN_NO_MATCH"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
  resource_id          = aws_api_gateway_resource.connect_outbound_read.id
  rest_api_id          = aws_api_gateway_rest_api.connect_outbound.id
  timeout_milliseconds = "29000"
  type                 = "MOCK"
}

resource "aws_api_gateway_integration" "connect_outbound_make_options" {
  depends_on           = [aws_api_gateway_method.connect_outbound_make_options]
  cache_namespace      = aws_api_gateway_resource.connect_outbound_make.id
  connection_type      = "INTERNET"
  http_method          = "OPTIONS"
  passthrough_behavior = "WHEN_NO_MATCH"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
  resource_id          = aws_api_gateway_resource.connect_outbound_make.id
  rest_api_id          = aws_api_gateway_rest_api.connect_outbound.id
  timeout_milliseconds = "29000"
  type                 = "MOCK"
}

resource "aws_api_gateway_integration" "connect_outbound_scan" {
  http_method             = "POST"
  resource_id             = aws_api_gateway_resource.connect_outbound_read.id
  rest_api_id             = aws_api_gateway_rest_api.connect_outbound.id
  type                    = "AWS"
  integration_http_method = "POST"
  uri                     = "arn:aws:apigateway:${var.environment.region}:dynamodb:action/Scan"
  credentials             = aws_iam_role.RoleForMakeCampaign.arn
  passthrough_behavior    = "WHEN_NO_MATCH"
  timeout_milliseconds    = 29000

  request_templates = {
    "application/json" = <<EOF
{
  "TableName": "${var.dynamo.table1}"
}
EOF
  }
}

resource "aws_api_gateway_integration" "connect_outbound_make_post" {
  cache_namespace         = aws_api_gateway_resource.connect_outbound_make.id
  connection_type         = "INTERNET"
  content_handling        = "CONVERT_TO_TEXT"
  http_method             = "POST"
  integration_http_method = "POST"
  passthrough_behavior    = "WHEN_NO_MATCH"
  resource_id             = aws_api_gateway_resource.connect_outbound_make.id
  rest_api_id             = aws_api_gateway_rest_api.connect_outbound.id
  timeout_milliseconds    = "29000"
  type                    = "AWS"
  uri                     = aws_lambda_function.lambda_makeCampaign.invoke_arn
}

resource "aws_api_gateway_integration_response" "connect_outbound_read_options" {
  depends_on  = [aws_api_gateway_method.connect_outbound_read_options, aws_api_gateway_integration.connect_outbound_read_options]
  http_method = "OPTIONS"
  resource_id = aws_api_gateway_resource.connect_outbound_read.id
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
  status_code = "200"

}

resource "aws_api_gateway_integration_response" "connect_outbound_make_options" {
  depends_on  = [aws_api_gateway_method.connect_outbound_make_options, aws_api_gateway_integration.connect_outbound_make_options]
  http_method = "OPTIONS"
  resource_id = aws_api_gateway_resource.connect_outbound_make.id
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
  status_code = "200"

}

resource "aws_api_gateway_integration_response" "connect_outbound_read_post" {
  depends_on  = [aws_api_gateway_method.connect_outbound_read_post, aws_api_gateway_integration.connect_outbound_scan]
  http_method = "POST"
  resource_id = aws_api_gateway_resource.connect_outbound_read.id
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
  status_code = "200"
  response_templates = {
    "application/json" = <<EOF
#set($inputRoot = $input.path('$'))
{
  "items": [
    #foreach($item in $inputRoot.Items)
    {
      #foreach($key in $item.keySet())
        "$key": 
        #if($item.get($key).S)"$item.get($key).S"
        #elseif($item.get($key).N)$item.get($key).N
        #elseif($item.get($key).BOOL)$item.get($key).BOOL
        #else"$item.get($key)"#end
        #if($foreach.hasNext),#end
      #end
    }#if($foreach.hasNext),#end
    #end
  ],
  "count": $inputRoot.Count,
  "scannedCount": $inputRoot.ScannedCount
}
EOF
  }
}

resource "aws_api_gateway_integration_response" "connect_admin_post" {
  depends_on  = [aws_api_gateway_method.connect_outbound_make_post, aws_api_gateway_integration.connect_outbound_make_post]
  http_method = "POST"
  resource_id = aws_api_gateway_resource.connect_outbound_make.id
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
  status_code = "200"
}

resource "aws_api_gateway_deployment" "cconnect_outbound_deployment" {
  depends_on  = [aws_api_gateway_integration.connect_outbound_make_options, aws_api_gateway_integration.connect_outbound_read_options, aws_api_gateway_integration.connect_outbound_scan]
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_api_gateway_stage" "connect_outbound" {
  cache_cluster_enabled = "false"
  deployment_id         = aws_api_gateway_deployment.cconnect_outbound_deployment.id
  rest_api_id           = aws_api_gateway_rest_api.connect_outbound.id
  stage_name            = "connect-outbound"
  xray_tracing_enabled  = "false"
}

#resource "aws_lambda_permission" "connect_outbound_read" {
#  statement_id  = "AllowAPIGatewayInvoke_Connect_Outbound"
#  action        = "lambda:InvokeFunction"
#  function_name = "outbound"
#  principal     = "apigateway.amazonaws.com" # For API Gateway
#  # Define the source ARN for your API Gateway
#  source_arn = "${aws_api_gateway_rest_api.connect_outbound.execution_arn}/*/*/*"
#}

resource "aws_api_gateway_gateway_response" "connect_outbound_4xx" {
  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "gatewayresponse.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST'"
    "gatewayresponse.header.Access-Control-Allow-Origin"  = "'*'"
  }

  response_templates = {
    "application/json" = "{\"message\":$context.error.messageString}"
  }

  response_type = "DEFAULT_4XX"
  rest_api_id   = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_api_gateway_gateway_response" "connect_outbound_5xx" {
  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "gatewayresponse.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST'"
    "gatewayresponse.header.Access-Control-Allow-Origin"  = "'*'"
  }

  response_templates = {
    "application/json" = "{\"message\":$context.error.messageString}"
  }

  response_type = "DEFAULT_5XX"
  rest_api_id   = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_lambda_permission" "connect_outbound" {
  statement_id  = "AllowAPIGatewayInvoke_Connect_Outbound"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_makeCampaign.function_name
  principal     = "apigateway.amazonaws.com" # For API Gateway
  # Define the source ARN for your API Gateway
  source_arn = "${aws_api_gateway_rest_api.connect_outbound.execution_arn}/*/*/*"
}