variable "environment" {
  type = object({
    name       = string
    region     = string
    account_id = string
    tla        = string
  })
  sensitive = false
}

variable "dynamo" {
  type = object({
    table1    = string
    hash_key1 = string
    table2    = string
    hash_key2 = string
    table3    = string
    hash_key3 = string
    table4    = string
    hash_key4 = string
    table5    = string
    hash_key5 = string
  })
  sensitive = false
}
