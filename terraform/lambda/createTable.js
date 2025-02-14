const { DynamoDBClient, CreateTableCommand } = require("@aws-sdk/client-dynamodb");

// Set up the DynamoDB client
const client = new DynamoDBClient({ region: "ap-southeast-1" }); // Change region as needed

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

    console.log(params);

    // Create the CreateTableCommand
    const command = new CreateTableCommand(params);

    // Send the command to create the table
    const response = await client.send(command);
    console.log(`Table ${tableName} created successfully!`, response);

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