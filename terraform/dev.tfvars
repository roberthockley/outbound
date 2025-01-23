project = {
  tla = "toku"
}

environment = {
  name            = "uat"
  region          = "ap-southeast-1"
  account_id      = "117134819170"
}

dynamo = {
  table1     = "Outbound"
  range_key1 = "campaign"
  hash_key1  = "number"
}
