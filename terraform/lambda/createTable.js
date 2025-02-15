const { DynamoDBClient, CreateTableCommand } = require("@aws-sdk/client-dynamodb");
const { EventBridgeClient, PutRuleCommand, PutTargetsCommand } = require("@aws-sdk/client-eventbridge"); // ES Modules import
const { LambdaClient, AddPermissionCommand } = require("@aws-sdk/client-lambda");
const eventClient = new EventBridgeClient({ region: "ap-southeast-1" });
const lambdaClient = new LambdaClient({ region: "ap-southeast-1" });
// Set up the DynamoDB client
const dynamoClient = new DynamoDBClient({ region: "ap-southeast-1" }); // Change region as needed

exports.handler = async (event, context) => {
  try {
    // Define the table parameters
    console.log(event);
    const tableName = event.tableName;
    const keySchema = [
      { AttributeName: "number", KeyType: "HASH" },
    ];
    const attributeDefinitions = [
      { AttributeName: "number", AttributeType: "S" },
    ];

    const params = {
      TableName: tableName,
      KeySchema: keySchema,
      AttributeDefinitions: attributeDefinitions,
      BillingMode: "PAY_PER_REQUEST",
    };

    // Create the CreateTableCommand
    const dynamoCommand = new CreateTableCommand(params);

    // Send the command to create the table
    const dynamoresponse = await dynamoClient.send(dynamoCommand);

    const ruleInput = { // PutRuleRequest
      Name: `${event.campaign}_Outbound`, // required
      ScheduleExpression: "cron(0/3 * * * ? *)", // every 3 minutes
      State: "DISABLED",
      Description: `${event.campaign} Outbound Rule`,
      RoleArn: process.env.roleARN,
      EventBusName: "default",
    };
    const ruleCommand = new PutRuleCommand(ruleInput);
    const ruleResponse = await eventClient.send(ruleCommand);
    console.log(ruleResponse)
    const targetInput = { // PutTargetsRequest
      Rule: `${event.campaign}_Outbound`, // required
      EventBusName: "default",
      Targets: [ // TargetList // required
        { // Target
          Id: "STRING_VALUE", // required
          Arn: process.env.readCampaignFunctionARN, // required arn of Lambda
          Input: `{"campaign":"${event.campaign}"}`
        }
      ]
    };
    const targetCommand = new PutTargetsCommand(targetInput);
    const targetResponse = await eventClient.send(targetCommand);

    const lambdaInput = { // AddPermissionRequest
      FunctionName: process.env.readCampaignFunctionName, // required
      StatementId: `${event.campaign}_Outbound`, // required
      Action: "lambda:InvokeFunction", // required
      Principal: "events.amazonaws.com", // required
      SourceArn: ruleResponse.RuleArn
    };
    const lambdaCommand = new AddPermissionCommand(lambdaInput);
    const lambdaResponse = await lambdaClient.send(lambdaCommand);

    return {
      statusCode: 200,
      body: JSON.stringify(`Table ${tableName} created successfully!`),
    };
  } catch (err) {
    console.error("Error creating table:", err);
    return {
      statusCode: 400,
      body: JSON.stringify(err.message),
    };
  }
};