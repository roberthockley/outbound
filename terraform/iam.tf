resource "aws_iam_role" "RoleForMakeCampaign" {
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
  name        = "RoleForMakeCampaign"
}

resource "aws_iam_policy" "RoleForMakeCampaignIAM" {
  name        = "RoleForMakeCampaignIAM"
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


resource "aws_iam_role_policy_attachment" "RoleForMakeCampaign_AmazonDynamoDBFullAccess" {
  depends_on = [aws_iam_role.RoleForMakeCampaign]
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
  role       = "RoleForMakeCampaign"
}

resource "aws_iam_role_policy_attachment" "RoleForMakeCampaign_CloudWatchLogsFullAccess" {
  depends_on = [aws_iam_role.RoleForMakeCampaign]
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
  role       = "RoleForMakeCampaign"
}

resource "aws_iam_role_policy_attachment" "RoleForMakeCampaign_DynamoDBFullAccess" {
  depends_on = [aws_iam_role.RoleForMakeCampaign]
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
  role       = "RoleForMakeCampaign"
}

resource "aws_iam_role_policy_attachment" "RoleForMakeCampaign_LambdaFullAccess" {
  depends_on = [aws_iam_role.RoleForMakeCampaign]
  policy_arn = "arn:aws:iam::aws:policy/AWSLambda_FullAccess"
  role       = "RoleForMakeCampaign"
}

resource "aws_iam_role_policy_attachment" "RoleForMakeCampaign_CloudWatchEventsFullAccess" {
  depends_on = [aws_iam_role.RoleForMakeCampaign]
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchEventsFullAccess"
  role       = "RoleForMakeCampaign"
}

resource "aws_iam_role_policy_attachment" "RoleForMakeCampaign_IAM" {
  depends_on = [aws_iam_role.RoleForMakeCampaign]
  policy_arn = aws_iam_policy.RoleForMakeCampaignIAM.arn
  role       = "RoleForMakeCampaign"
}