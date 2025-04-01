resource "aws_cloudwatch_event_rule" "postcallsummary" {

  name = "postcallsummary"
  event_pattern = jsonencode({
    source        = ["aws.connect"]
    "detail-type" = ["Amazon Connect Contact Event"]
    detail = {
      eventType = ["DISCONNECTED"]
    }
  })
  depends_on  = [aws_lambda_function.lambda_postcallsummary]
  description = "Amazon Conenct Post Call Summary"

}

resource "aws_cloudwatch_event_target" "postcallsummary" {
  depends_on = [aws_lambda_function.lambda_postcallsummary]
  rule       = aws_cloudwatch_event_rule.postcallsummary.name
  arn        = aws_lambda_function.lambda_postcallsummary.arn
}
