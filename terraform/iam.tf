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

resource "aws_iam_policy" "RoleForDynamoDBIAM" {
  depends_on  = [aws_kms_key.kms_ihs] #### Ensure this is happening first
  name        = "${var.project.tla}-${var.environment.name}-secrets_rotation"
  path        = "/"
  description = "For the Secret Rotation Lambda"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        "Sid" : "VisualEditor0",
        "Effect" : "Allow",
        "Action" : [
          "iam:PassRole"
        ],
        "Resource" : [
          "arn:aws:iam::117134819170:role/Events",
        ]
      }
    ]
  })
}


resource "aws_iam_role_policy_attachment" "RoleForDynamoDB_AmazonDynamoDBFullAccess" {
  depends_on = [aws_iam_role.RoleForDynamoDB]
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
  role       = "RoleForDynamoDB"
}

resource "aws_iam_role_policy_attachment" "RoleForDynamoDB_CloudWatchLogsFullAccess" {
  depends_on = [aws_iam_role.RoleForDynamoDB]
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
  role       = "RoleForDynamoDB"
}

resource "aws_iam_role_policy_attachment" "RoleForDynamoDB_DynamoDBFullAccess" {
  depends_on = [aws_iam_role.RoleForDynamoDB]
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
  role       = "RoleForDynamoDB"
}

resource "aws_iam_role_policy_attachment" "RoleForDynamoDB_LambdaFullAccess" {
  depends_on = [aws_iam_role.RoleForDynamoDB]
  policy_arn = "arn:aws:iam::aws:policy/AWSLambda_FullAccess"
  role       = "RoleForDynamoDB"
}

resource "aws_iam_role_policy_attachment" "RoleForDynamoDB_CloudWatchEventsFullAccess" {
  depends_on = [aws_iam_role.RoleForDynamoDB]
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchEventsFullAccess"
  role       = "RoleForDynamoDB"
}
