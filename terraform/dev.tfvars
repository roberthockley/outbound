environment = {
  name       = "uat"
  region     = "ap-southeast-1"
  account_id = "117134819170"
  tla        = "song"
}

dynamo = {
  table1    = "OutboundRules"
  hash_key1 = "campaign"
  table2    = "DND"
  hash_key2 = "number"
}
