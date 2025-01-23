resource "aws_dynamodb_table" "outbound_table" {
  name         = var.dynamo.table1
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = var.dynamo.hash_key1
  range_key    = var.dynamo.range_key1
  attribute {
    name = var.dynamo.hash_key1
    type = "N"
  }

  attribute {
    name = var.dynamo.range_key1
    type = "S"
  }

  tags = {
    Name        = "${var.dynamo.table1}"
    Environment = "${var.environment.name}"
  }
}
