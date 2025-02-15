
const { EventBridgeClient, PutRuleCommand, PutTargetsCommand } = require("@aws-sdk/client-eventbridge"); // ES Modules import
const { LambdaClient, AddPermissionCommand } = require( "@aws-sdk/client-lambda");
const eventClient = new EventBridgeClient({ region: "ap-southeast-1" });
const lambdaClient = new LambdaClient({ region: "ap-southeast-1" });

exports.handler = async (event, context) => {

    const ruleInput = { // PutRuleRequest
        Name: `${event.campaign}_Outbound`, // required
        ScheduleExpression: "cron(0/3 * * * ? *)", // every 3 minutes
        State: "ENABLED",
        Description: `${event.campaign} Outbound Rule`,
        RoleArn: "arn:aws:iam::117134819170:role/Events",
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
                Arn: "arn:aws:lambda:ap-southeast-1:117134819170:function:KVS", // required arn of Lambda
                Input: `{"campaign":"${event.campaign}"}`
            }
        ]
    };
    const targetCommand = new PutTargetsCommand(targetInput);
    const targetResponse = await eventClient.send(targetCommand);

    const lambdaInput = { // AddPermissionRequest
      FunctionName: "KVS", // required
      StatementId: `${event.campaign}_Outbound`, // required
      Action: "lambda:InvokeFunction", // required
      Principal: "events.amazonaws.com", // required
      SourceArn: ruleResponse.RuleArn
    };
    const lambdaCommand = new AddPermissionCommand(lambdaInput);
    const response = await lambdaClient.send(lambdaCommand);
};