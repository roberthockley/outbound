resource "aws_iam_role" "RoleForDynamoDB" {
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = ["apigateway.amazonaws.com",
          "lambda.amazonaws.com"]
        }
      }
    ]
  })
  description = "Allows Lambda functions to call AWS services on your behalf."
  name        = "RoleForDynamoDB"
}

resource "aws_iam_role_policy_attachment" "RoleForDynamoDB_AmazonDynamoDBFullAccess" {
  depends_on = [aws_iam_role.RoleForDynamoDB]
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
  role       = "RoleForDynamoDB"
}

resource "aws_iam_role_policy_attachment" "RoleForDynamoDB_AmazonDynamoDBReadOnlyAccess" {
  depends_on = [aws_iam_role.RoleForDynamoDB]
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBReadOnlyAccess"
  role       = "RoleForDynamoDB"
}

resource "aws_iam_role_policy_attachment" "RoleForDynamoDB_CloudWatchLogsFullAccess" {
  depends_on = [aws_iam_role.RoleForDynamoDB]
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
  role       = "RoleForDynamoDB"
}
