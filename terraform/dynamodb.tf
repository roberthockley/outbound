resource "aws_dynamodb_table" "outbound_table" {
  name         = var.dynamo.table1
  billing_mode = "PAY_PER_REQUEST"
  hash_key    = var.dynamo.hash_key1
  attribute {
    name = var.dynamo.hash_key1
    type = "S"
  }

  tags = {
    Name        = "${var.dynamo.table1}"
    Environment = "${var.environment.name}"
  }
}

resource "aws_dynamodb_table" "dnd_table" {
  name         = var.dynamo.table2
  billing_mode = "PAY_PER_REQUEST"
  hash_key    = var.dynamo.hash_key2
  attribute {
    name = var.dynamo.hash_key2
    type = "S"
  }

  tags = {
    Name        = "${var.dynamo.table2}"
    Environment = "${var.environment.name}"
  }
}

resource "aws_dynamodb_table_item" "dnd_table" {
  table_name = aws_dynamodb_table.dnd_table.name
  hash_key   = aws_dynamodb_table.dnd_table.hash_key

  item = <<ITEM
{
  "name": {"S": "Global"}
}
ITEM
}

resource "aws_dynamodb_table" "dndGlobal_table" {
  name         = var.dynamo.table3
  billing_mode = "PAY_PER_REQUEST"
  hash_key    = var.dynamo.hash_key3
  attribute {
    name = var.dynamo.hash_key3
    type = "S"
  }

  tags = {
    Name        = "${var.dynamo.table3}"
    Environment = "${var.environment.name}"
  }
}

resource "aws_dynamodb_table" "schedules_table" {
  name         = var.dynamo.table4
  billing_mode = "PAY_PER_REQUEST"
  hash_key    = var.dynamo.hash_key4
  attribute {
    name = var.dynamo.hash_key4
    type = "S"
  }

  tags = {
    Name        = "${var.dynamo.table4}"
    Environment = "${var.environment.name}"
  }
}

resource "aws_dynamodb_table" "disposition_table" {
  name         = var.dynamo.table5
  billing_mode = "PAY_PER_REQUEST"
  hash_key    = var.dynamo.hash_key5
  attribute {
    name = var.dynamo.hash_key5
    type = "S"
  }

  tags = {
    Name        = "${var.dynamo.table5}"
    Environment = "${var.environment.name}"
  }
}