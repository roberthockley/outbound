terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

#Configure the AWS Provider
provider "aws" {
  region     = "ap-southeast-1"
  access_key = "AKIA4MTWNOGLYGKQ5FES"
  secret_key = "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"
  #token      = "IQoJb3JpZ2luX2VjEJn//////////wEaDmFwLXNvdXRoZWFzdC0xIkgwRgIhAL5Id9feMV7nNAMLLXbx1aULoAdZIrrAc3oNSskB1LYRAiEAjLPH52CWTWtaVMmKkCXZ0omm6KKAcW6gMTdURNumhsQqpQMIUhAAGgw5NzI0Mjk2ODE1OTgiDEo3PGRvQslhTBGHSiqCA8Q9Nm8c4u09m7Bx3j9KcP14iLEfgdw5damug9835qcYtp6MH1yBliGQ4xdHIAjvZIPoUW6R8AQiIJXbupIGosYLu+CNMuuY+Yqp5xZM2WTROKkfEkJg1qL8xRSYu+DTmBi6cBACbaLeskkMdbEJxOwDzM3YW2xJV/miiSXbGo89J4QONDsGR08RdDyodreVB4I7ioVAfrGHp4L4HzWvHGDBGJoOcciA5DLZHabM0LKujMQ1xW5sasqhl9BRDcv4+rwF84wtjxIlvensJhJekLXsUoquzotN2FvODPgZtVA8FFFpm56s2J6EeNEydCg637ZkV5g3u2Ct5+ujsYsixC0f1q4cRnfEfdxfscqOJj4ofJpXZExqkJC7svVFwLx06mm2cAlBR+FuZMCHeaI8kCcOvOlwxwFnSdJlUfr8etSgweJphCfHshz5t7FpuNxE+7xbis50E1/JxGH5XDuDlSVpmNPCiDcCGi0F/Jbbr/RRQcfaajB5lbYbv160aE4arNVLMKylvK0GOqUB0ujUnSjit+PL5hmm+vPKR5BIMUGK5mXwJHmR70fySz1ffvN1p0A9Qz3P7zWBaIm/6yHAWbs1elcbS0ZM6Ji3H5cfADyZofyVTV4B3O3vGHw2o6SZdnfGT+1kXdEElbZI6LZCte9E9y7r3t1KgXZysyfDwHARqDtdrrtYcUhSsUSFUjuABwbb0rooAZ5VRqnRKNF+qh4JrIkzuW+B2wQ5xyKF0t2B"
  assume_role {
  role_arn    = "arn:aws:iam::${var.environment.account_id}:role/toku_iac"
  external_id = "toku_iac"
  }
}