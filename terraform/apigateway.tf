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
  path_part   = "readSettings"
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
}


resource "aws_api_gateway_method" "connect_outbound_read_options" {
  api_key_required = "false"
  authorization    = "NONE"
  http_method      = "OPTIONS"
  resource_id      = aws_api_gateway_resource.connect_outbound_read.id
  rest_api_id      = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_api_gateway_method" "connect_outbound_read_post" {
  api_key_required = "false"
  authorization    = "NONE"
  http_method      = "POST"
  resource_id      = aws_api_gateway_resource.connect_outbound_read.id
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

resource "aws_api_gateway_integration" "connect_outbound_read_post" {
  depends_on              = [aws_api_gateway_method.connect_outbound_read_post]
  http_method             = "POST"
  resource_id             = aws_api_gateway_resource.connect_outbound_read.id
  rest_api_id             = aws_api_gateway_rest_api.connect_outbound.id
  type                    = "AWS"
  integration_http_method = "POST"
  uri                     = "arn:aws:apigateway:${var.environment.region}:dynamodb:action/Scan"
  credentials             = aws_iam_role.RoleForMakeCampaign.arn
  passthrough_behavior    = "WHEN_NO_MATCH"
  timeout_milliseconds    = 29000
}

resource "aws_api_gateway_integration_response" "connect_outbound_read_options" {
  depends_on  = [aws_api_gateway_method_response.connect_outbound_read_options, aws_api_gateway_method.connect_outbound_read_options, aws_api_gateway_integration.connect_outbound_read_options]
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

resource "aws_api_gateway_integration_response" "connect_outbound_read_post" {
  depends_on  = [aws_api_gateway_method_response.connect_outbound_read_post, aws_api_gateway_method.connect_outbound_read_post, aws_api_gateway_integration.connect_outbound_read_post]
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


resource "aws_api_gateway_resource" "connect_outbound_update" {
  parent_id   = aws_api_gateway_rest_api.connect_outbound.root_resource_id
  path_part   = "updateSettings"
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_api_gateway_method" "connect_outbound_update_options" {
  api_key_required = "false"
  authorization    = "NONE"
  http_method      = "OPTIONS"
  resource_id      = aws_api_gateway_resource.connect_outbound_update.id
  rest_api_id      = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_api_gateway_method" "connect_outbound_update_post" {
  api_key_required = "false"
  authorization    = "NONE"
  http_method      = "POST"
  resource_id      = aws_api_gateway_resource.connect_outbound_update.id
  rest_api_id      = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_api_gateway_method_response" "connect_outbound_update_options" {
  depends_on  = [aws_api_gateway_method.connect_outbound_update_options]
  http_method = "OPTIONS"
  resource_id = aws_api_gateway_resource.connect_outbound_update.id
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

resource "aws_api_gateway_method_response" "connect_outbound_update_post" {
  depends_on  = [aws_api_gateway_method.connect_outbound_update_post]
  http_method = "POST"
  resource_id = aws_api_gateway_resource.connect_outbound_update.id
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "false"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
  status_code = "200"
}

resource "aws_api_gateway_integration" "connect_outbound_update_options" {
  depends_on           = [aws_api_gateway_method.connect_outbound_update_options]
  cache_namespace      = aws_api_gateway_resource.connect_outbound_update.id
  connection_type      = "INTERNET"
  http_method          = "OPTIONS"
  passthrough_behavior = "WHEN_NO_MATCH"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
  resource_id          = aws_api_gateway_resource.connect_outbound_update.id
  rest_api_id          = aws_api_gateway_rest_api.connect_outbound.id
  timeout_milliseconds = "29000"
  type                 = "MOCK"
}

resource "aws_api_gateway_integration" "connect_outbound_update_post" {
  depends_on              = [aws_api_gateway_method.connect_outbound_update_post]
  http_method             = "POST"
  resource_id             = aws_api_gateway_resource.connect_outbound_update.id
  rest_api_id             = aws_api_gateway_rest_api.connect_outbound.id
  type                    = "AWS"
  integration_http_method = "POST"
  uri                     = "arn:aws:apigateway:${var.environment.region}:dynamodb:action/UpdateItem"
  credentials             = aws_iam_role.RoleForMakeCampaign.arn
  passthrough_behavior    = "WHEN_NO_MATCH"
  timeout_milliseconds    = 29000
}

resource "aws_api_gateway_integration_response" "connect_outbound_update_options" {
  depends_on  = [aws_api_gateway_method_response.connect_outbound_update_options, aws_api_gateway_method.connect_outbound_update_options, aws_api_gateway_integration.connect_outbound_update_options]
  http_method = "OPTIONS"
  resource_id = aws_api_gateway_resource.connect_outbound_update.id
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
  status_code = "200"

}

resource "aws_api_gateway_integration_response" "connect_update_post" {
  depends_on  = [aws_api_gateway_method_response.connect_outbound_update_post, aws_api_gateway_integration.connect_outbound_update_post, aws_api_gateway_method.connect_outbound_update_post]
  http_method = "POST"
  resource_id = aws_api_gateway_resource.connect_outbound_update.id
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
  status_code = "200"
}

resource "aws_api_gateway_resource" "connect_outbound_make" {
  parent_id   = aws_api_gateway_rest_api.connect_outbound.root_resource_id
  path_part   = "makeSettings"
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_api_gateway_method" "connect_outbound_make_options" {
  api_key_required = "false"
  authorization    = "NONE"
  http_method      = "OPTIONS"
  resource_id      = aws_api_gateway_resource.connect_outbound_make.id
  rest_api_id      = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_api_gateway_method" "connect_outbound_make_post" {
  api_key_required = "false"
  authorization    = "NONE"
  http_method      = "POST"
  resource_id      = aws_api_gateway_resource.connect_outbound_make.id
  rest_api_id      = aws_api_gateway_rest_api.connect_outbound.id
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

resource "aws_api_gateway_method_response" "connect_outbound_make_post" {
  depends_on  = [aws_api_gateway_method.connect_outbound_make_post]
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

resource "aws_api_gateway_integration" "connect_outbound_make_post" {
  depends_on              = [aws_api_gateway_method.connect_outbound_make_post]
  http_method             = "POST"
  resource_id             = aws_api_gateway_resource.connect_outbound_make.id
  rest_api_id             = aws_api_gateway_rest_api.connect_outbound.id
  type                    = "AWS"
  integration_http_method = "POST"
  uri                     = "arn:aws:apigateway:${var.environment.region}:dynamodb:action/PutItem"
  credentials             = aws_iam_role.RoleForMakeCampaign.arn
  passthrough_behavior    = "WHEN_NO_MATCH"
  timeout_milliseconds    = 29000
}

resource "aws_api_gateway_integration_response" "connect_outbound_make_options" {
  depends_on  = [aws_api_gateway_method_response.connect_outbound_make_options, aws_api_gateway_method.connect_outbound_make_options, aws_api_gateway_integration.connect_outbound_make_options]
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

resource "aws_api_gateway_integration_response" "connect_make_post" {
  depends_on  = [aws_api_gateway_integration.connect_outbound_make_post, aws_api_gateway_method_response.connect_outbound_make_post, aws_api_gateway_method.connect_outbound_make_post]
  http_method = "POST"
  resource_id = aws_api_gateway_resource.connect_outbound_make.id
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
  status_code = "200"
}

resource "aws_api_gateway_resource" "connect_outbound_delete" {
  parent_id   = aws_api_gateway_rest_api.connect_outbound.root_resource_id
  path_part   = "deleteSettings"
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_api_gateway_method" "connect_outbound_delete_options" {
  api_key_required = "false"
  authorization    = "NONE"
  http_method      = "OPTIONS"
  resource_id      = aws_api_gateway_resource.connect_outbound_delete.id
  rest_api_id      = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_api_gateway_method" "connect_outbound_delete_post" {
  api_key_required = "false"
  authorization    = "NONE"
  http_method      = "POST"
  resource_id      = aws_api_gateway_resource.connect_outbound_delete.id
  rest_api_id      = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_api_gateway_method_response" "connect_outbound_delete_options" {
  depends_on  = [aws_api_gateway_method.connect_outbound_delete_options]
  http_method = "OPTIONS"
  resource_id = aws_api_gateway_resource.connect_outbound_delete.id
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

resource "aws_api_gateway_method_response" "connect_outbound_delete_post" {
  depends_on  = [aws_api_gateway_method.connect_outbound_delete_post]
  http_method = "POST"
  resource_id = aws_api_gateway_resource.connect_outbound_delete.id
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "false"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
  status_code = "200"
}

resource "aws_api_gateway_integration" "connect_outbound_delete_options" {
  depends_on           = [aws_api_gateway_method.connect_outbound_delete_options]
  cache_namespace      = aws_api_gateway_resource.connect_outbound_delete.id
  connection_type      = "INTERNET"
  http_method          = "OPTIONS"
  passthrough_behavior = "WHEN_NO_MATCH"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
  resource_id          = aws_api_gateway_resource.connect_outbound_delete.id
  rest_api_id          = aws_api_gateway_rest_api.connect_outbound.id
  timeout_milliseconds = "29000"
  type                 = "MOCK"
}

resource "aws_api_gateway_integration" "connect_outbound_delete_post" {
  depends_on              = [aws_api_gateway_method.connect_outbound_delete_post]
  http_method             = "POST"
  resource_id             = aws_api_gateway_resource.connect_outbound_delete.id
  rest_api_id             = aws_api_gateway_rest_api.connect_outbound.id
  type                    = "AWS"
  integration_http_method = "POST"
  uri                     = "arn:aws:apigateway:${var.environment.region}:dynamodb:action/DeleteItem"
  credentials             = aws_iam_role.RoleForMakeCampaign.arn
  passthrough_behavior    = "WHEN_NO_MATCH"
  timeout_milliseconds    = 29000
}

resource "aws_api_gateway_integration_response" "connect_outbound_delete_options" {
  depends_on  = [aws_api_gateway_method_response.connect_outbound_delete_options, aws_api_gateway_integration.connect_outbound_delete_options]
  http_method = "OPTIONS"
  resource_id = aws_api_gateway_resource.connect_outbound_delete.id
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
  status_code = "200"
}

resource "aws_api_gateway_integration_response" "connect_delete_post" {
  depends_on  = [aws_api_gateway_integration.connect_outbound_delete_post, aws_api_gateway_method_response.connect_outbound_delete_post, aws_api_gateway_integration.connect_outbound_read_post, aws_api_gateway_method_response.connect_outbound_read_post]
  http_method = "POST"
  resource_id = aws_api_gateway_resource.connect_outbound_delete.id
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
  status_code = "200"
}

resource "aws_api_gateway_resource" "connect_outbound_numbers" {
  parent_id   = aws_api_gateway_rest_api.connect_outbound.root_resource_id
  path_part   = "getNumbers"
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_api_gateway_method" "connect_outbound_numbers_options" {
  api_key_required = "false"
  authorization    = "NONE"
  http_method      = "OPTIONS"
  resource_id      = aws_api_gateway_resource.connect_outbound_numbers.id
  rest_api_id      = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_api_gateway_method" "connect_outbound_numbers_post" {
  api_key_required = "false"
  authorization    = "NONE"
  http_method      = "POST"
  resource_id      = aws_api_gateway_resource.connect_outbound_numbers.id
  rest_api_id      = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_api_gateway_method_response" "connect_outbound_numbers_options" {
  depends_on  = [aws_api_gateway_method.connect_outbound_numbers_options]
  http_method = "OPTIONS"
  resource_id = aws_api_gateway_resource.connect_outbound_numbers.id
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

resource "aws_api_gateway_method_response" "connect_outbound_numbers_post" {
  depends_on  = [aws_api_gateway_method.connect_outbound_numbers_post]
  http_method = "POST"
  resource_id = aws_api_gateway_resource.connect_outbound_numbers.id
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "false"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
  status_code = "200"
}

resource "aws_api_gateway_integration" "connect_outbound_numbers_options" {
  depends_on           = [aws_api_gateway_method.connect_outbound_numbers_options]
  cache_namespace      = aws_api_gateway_resource.connect_outbound_numbers.id
  connection_type      = "INTERNET"
  http_method          = "OPTIONS"
  passthrough_behavior = "WHEN_NO_MATCH"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
  resource_id          = aws_api_gateway_resource.connect_outbound_numbers.id
  rest_api_id          = aws_api_gateway_rest_api.connect_outbound.id
  timeout_milliseconds = "29000"
  type                 = "MOCK"
}

resource "aws_api_gateway_integration" "connect_outbound_numbers_post" {
  depends_on              = [aws_api_gateway_method.connect_outbound_numbers_post]
  http_method             = "POST"
  resource_id             = aws_api_gateway_resource.connect_outbound_numbers.id
  rest_api_id             = aws_api_gateway_rest_api.connect_outbound.id
  type                    = "AWS"
  integration_http_method = "POST"
  uri                     = "arn:aws:apigateway:${var.environment.region}:connect:path/phone-number/list"
  credentials             = aws_iam_role.RoleForMakeCampaign.arn
  passthrough_behavior    = "WHEN_NO_MATCH"
  timeout_milliseconds    = 29000
}

resource "aws_api_gateway_integration_response" "connect_outbound_numbers_options" {
  depends_on  = [aws_api_gateway_method_response.connect_outbound_numbers_options, aws_api_gateway_method.connect_outbound_numbers_options, aws_api_gateway_integration.connect_outbound_numbers_options]
  http_method = "OPTIONS"
  resource_id = aws_api_gateway_resource.connect_outbound_numbers.id
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
  status_code = "200"
}

resource "aws_api_gateway_integration_response" "connect_numbers_post" {
  depends_on  = [aws_api_gateway_integration.connect_outbound_numbers_post, aws_api_gateway_method_response.connect_outbound_numbers_post, aws_api_gateway_integration.connect_outbound_read_post, aws_api_gateway_method_response.connect_outbound_read_post]
  http_method = "POST"
  resource_id = aws_api_gateway_resource.connect_outbound_numbers.id
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
  status_code = "200"
}

resource "aws_api_gateway_resource" "connect_outbound_dnd" {
  parent_id   = aws_api_gateway_rest_api.connect_outbound.root_resource_id
  path_part   = "getDND"
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_api_gateway_method" "connect_outbound_dnd_options" {
  api_key_required = "false"
  authorization    = "NONE"
  http_method      = "OPTIONS"
  resource_id      = aws_api_gateway_resource.connect_outbound_dnd.id
  rest_api_id      = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_api_gateway_method" "connect_outbound_dnd_post" {
  api_key_required = "false"
  authorization    = "NONE"
  http_method      = "POST"
  resource_id      = aws_api_gateway_resource.connect_outbound_dnd.id
  rest_api_id      = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_api_gateway_method_response" "connect_outbound_dnd_options" {
  depends_on  = [aws_api_gateway_method.connect_outbound_dnd_options]
  http_method = "OPTIONS"
  resource_id = aws_api_gateway_resource.connect_outbound_dnd.id
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

resource "aws_api_gateway_method_response" "connect_outbound_dnd_post" {
  depends_on  = [aws_api_gateway_method.connect_outbound_dnd_post]
  http_method = "POST"
  resource_id = aws_api_gateway_resource.connect_outbound_dnd.id
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "false"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
  status_code = "200"
}

resource "aws_api_gateway_integration" "connect_outbound_dnd_options" {
  depends_on           = [aws_api_gateway_method.connect_outbound_dnd_options]
  cache_namespace      = aws_api_gateway_resource.connect_outbound_dnd.id
  connection_type      = "INTERNET"
  http_method          = "OPTIONS"
  passthrough_behavior = "WHEN_NO_MATCH"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
  resource_id          = aws_api_gateway_resource.connect_outbound_dnd.id
  rest_api_id          = aws_api_gateway_rest_api.connect_outbound.id
  timeout_milliseconds = "29000"
  type                 = "MOCK"
}

resource "aws_api_gateway_integration" "connect_outbound_dnd_post" {
  depends_on              = [aws_api_gateway_method.connect_outbound_dnd_post]
  http_method             = "POST"
  resource_id             = aws_api_gateway_resource.connect_outbound_dnd.id
  rest_api_id             = aws_api_gateway_rest_api.connect_outbound.id
  type                    = "AWS"
  integration_http_method = "POST"
  uri                     = "arn:aws:apigateway:${var.environment.region}:dynamodb:action/Scan"
  credentials             = aws_iam_role.RoleForMakeCampaign.arn
  passthrough_behavior    = "WHEN_NO_MATCH"
  timeout_milliseconds    = 29000
}

resource "aws_api_gateway_integration_response" "connect_outbound_dnd_options" {
  depends_on  = [aws_api_gateway_method_response.connect_outbound_dnd_options, aws_api_gateway_method.connect_outbound_dnd_options, aws_api_gateway_integration.connect_outbound_dnd_options]
  http_method = "OPTIONS"
  resource_id = aws_api_gateway_resource.connect_outbound_dnd.id
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
  status_code = "200"
}


resource "aws_api_gateway_resource" "connect_outbound_table" {
  parent_id   = aws_api_gateway_rest_api.connect_outbound.root_resource_id
  path_part   = "newCampaign"
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_api_gateway_method" "connect_outbound_table_options" {
  api_key_required = "false"
  authorization    = "NONE"
  http_method      = "OPTIONS"
  resource_id      = aws_api_gateway_resource.connect_outbound_table.id
  rest_api_id      = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_api_gateway_method" "connect_outbound_table_post" {
  api_key_required = "false"
  authorization    = "NONE"
  http_method      = "POST"
  resource_id      = aws_api_gateway_resource.connect_outbound_table.id
  rest_api_id      = aws_api_gateway_rest_api.connect_outbound.id
}


resource "aws_api_gateway_method_response" "connect_outbound_table_options" {
  depends_on  = [aws_api_gateway_method.connect_outbound_table_options]
  http_method = "OPTIONS"
  resource_id = aws_api_gateway_resource.connect_outbound_table.id
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

resource "aws_api_gateway_method_response" "connect_outbound_table_post" {
  depends_on = [aws_api_gateway_method.connect_outbound_table_post]

  http_method = "POST"
  resource_id = aws_api_gateway_resource.connect_outbound_table.id
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "false"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
  status_code = "200"
}

resource "aws_api_gateway_integration" "connect_outbound_table_options" {
  depends_on           = [aws_api_gateway_method.connect_outbound_table_options]
  cache_namespace      = aws_api_gateway_resource.connect_outbound_table.id
  connection_type      = "INTERNET"
  http_method          = "OPTIONS"
  passthrough_behavior = "WHEN_NO_MATCH"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
  resource_id          = aws_api_gateway_resource.connect_outbound_table.id
  rest_api_id          = aws_api_gateway_rest_api.connect_outbound.id
  timeout_milliseconds = "29000"
  type                 = "MOCK"
}

resource "aws_api_gateway_integration" "connect_outbound_table_post" {
  depends_on              = [aws_api_gateway_method.connect_outbound_table_post]
  http_method             = "POST"
  resource_id             = aws_api_gateway_resource.connect_outbound_table.id
  rest_api_id             = aws_api_gateway_rest_api.connect_outbound.id
  type                    = "AWS"
  integration_http_method = "POST"
  uri                     = "arn:aws:apigateway:${var.environment.region}:dynamodb:action/CreateTable"
  credentials             = aws_iam_role.RoleForMakeCampaign.arn
  passthrough_behavior    = "WHEN_NO_MATCH"
  timeout_milliseconds    = 29000
}

resource "aws_api_gateway_integration_response" "connect_outbound_table_options" {
  depends_on  = [aws_api_gateway_method_response.connect_outbound_table_options, aws_api_gateway_method.connect_outbound_table_options, aws_api_gateway_integration.connect_outbound_table_options]
  http_method = "OPTIONS"
  resource_id = aws_api_gateway_resource.connect_outbound_table.id
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
  status_code = "200"

}

resource "aws_api_gateway_integration_response" "connect_outbound_table_post" {
  depends_on  = [aws_api_gateway_method_response.connect_outbound_table_post, aws_api_gateway_integration.connect_outbound_table_post]
  http_method = "POST"
  resource_id = aws_api_gateway_resource.connect_outbound_table.id
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
  status_code = "200"
}

resource "aws_api_gateway_deployment" "connect_outbound_deployment" {
  depends_on  = [aws_api_gateway_integration.connect_outbound_table_post, aws_api_gateway_integration.connect_outbound_table_options, aws_api_gateway_integration.connect_outbound_delete_post, aws_api_gateway_integration.connect_outbound_delete_options, aws_api_gateway_integration.connect_outbound_make_post, aws_api_gateway_integration.connect_outbound_make_options, aws_api_gateway_integration.connect_outbound_dnd_post, aws_api_gateway_integration.connect_outbound_dnd_options, aws_api_gateway_integration.connect_outbound_numbers_post, aws_api_gateway_integration.connect_outbound_numbers_options, aws_api_gateway_integration.connect_outbound_update_post, aws_api_gateway_integration.connect_outbound_update_options, aws_api_gateway_integration.connect_outbound_read_options, aws_api_gateway_integration.connect_outbound_read_post]
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_api_gateway_stage" "connect_outbound" {
  cache_cluster_enabled = "false"
  deployment_id         = aws_api_gateway_deployment.connect_outbound_deployment.id
  rest_api_id           = aws_api_gateway_rest_api.connect_outbound.id
  stage_name            = "connect-outbound"
  xray_tracing_enabled  = "false"
}


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

resource "aws_api_gateway_resource" "connect_outbound_csv" {
  parent_id   = aws_api_gateway_rest_api.connect_outbound.root_resource_id
  path_part   = "csvUpload"
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
}


resource "aws_api_gateway_method" "connect_outbound_csv_options" {
  api_key_required = "false"
  authorization    = "NONE"
  http_method      = "OPTIONS"
  resource_id      = aws_api_gateway_resource.connect_outbound_csv.id
  rest_api_id      = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_api_gateway_method" "connect_outbound_csv_post" {
  api_key_required = "false"
  authorization    = "NONE"
  http_method      = "POST"
  resource_id      = aws_api_gateway_resource.connect_outbound_csv.id
  rest_api_id      = aws_api_gateway_rest_api.connect_outbound.id
}

resource "aws_api_gateway_method_response" "connect_outbound_csv_options" {
  http_method = "OPTIONS"
  resource_id = aws_api_gateway_resource.connect_outbound_csv.id
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

resource "aws_api_gateway_method_response" "connect_outbound_csv_post" {
  http_method = "POST"
  resource_id = aws_api_gateway_resource.connect_outbound_csv.id
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "false"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
  status_code = "200"
}

resource "aws_api_gateway_integration" "connect_outbound_csv_options" {
  cache_namespace      = aws_api_gateway_resource.connect_outbound_csv.id
  connection_type      = "INTERNET"
  http_method          = "OPTIONS"
  passthrough_behavior = "WHEN_NO_MATCH"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
  resource_id          = aws_api_gateway_resource.connect_outbound_csv.id
  rest_api_id          = aws_api_gateway_rest_api.connect_outbound.id
  timeout_milliseconds = "29000"
  type                 = "MOCK"
}

resource "aws_api_gateway_integration" "connect_outbound_csv_post" {
  cache_namespace         = aws_api_gateway_resource.connect_outbound_csv.id
  connection_type         = "INTERNET"
  content_handling        = "CONVERT_TO_TEXT"
  http_method             = "POST"
  integration_http_method = "POST"
  passthrough_behavior    = "WHEN_NO_MATCH"
  resource_id             = aws_api_gateway_resource.connect_outbound_csv.id
  rest_api_id             = aws_api_gateway_rest_api.connect_outbound.id
  timeout_milliseconds    = "29000"
  type                    = "AWS"
  uri                     = "arn:aws:apigateway:ap-southeast-1:lambda:path/2015-03-31/functions/arn:aws:lambda:ap-southeast-1:${var.environment.account_id}:function:csv2Dynamo/invocations"
}

resource "aws_api_gateway_integration_response" "connect_outbound_csv_options" {
  http_method = "OPTIONS"
  resource_id = aws_api_gateway_resource.connect_outbound_csv.id
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
  status_code = "200"
}

resource "aws_api_gateway_integration_response" "connect_outbound_csv_post" {
  depends_on  = [aws_api_gateway_resource.connect_admin]
  http_method = "POST"
  resource_id = aws_api_gateway_resource.connect_outbound_csv.id
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }
  rest_api_id = aws_api_gateway_rest_api.connect_outbound.id
  status_code = "200"
}

resource "aws_lambda_permission" "connect_outbound" {
  statement_id  = "AllowAPIGatewayInvoke_Connect_Outbound"
  action        = "lambda:InvokeFunction"
  function_name = "csv2Dynamo"
  principal     = "apigateway.amazonaws.com" # For API Gateway
  # Define the source ARN for your API Gateway
  source_arn = "${aws_api_gateway_rest_api.connect_outbound.execution_arn}/*/*/*"
}
