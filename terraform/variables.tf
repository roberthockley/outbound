variable "project" {
  type = object({
    tla = string
  })
  sensitive = false
}

variable "environment" {
  type = object({
    name            = string
    region          = string
    account_id      = string
  })
  sensitive = false
}

variable "dynamo" {
  type = object({
    table1     = string
    range_key1 = string
    hash_key1  = string
  })
  sensitive = false
}
