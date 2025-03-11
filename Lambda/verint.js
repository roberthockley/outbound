const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
exports.handler = async (event) => {
  console.log(event)
  switch (event.searchType) {
    case "ani":
      console.log("Search by Phone")
      return await searchByPhone(event);
      break;
    case "aniWithTime":
      console.log("Search by Phone and Audio Start Time");
      return await searchByPhoneAndDateRange(event);
      break;
      case "time":
        console.log("Search by Audio Start Time");
        return await searchDateRange(event);
        break;
    case "presign":
      console.log("Generate Presigned URL");
      return await generatePresignedUrl(event);
      break;
    default:
  }

  async function searchByPhone() {
    try {
      // Validate input
      if (!event.ani) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Missing 'ani' parameter in query string" })
        };
      }

      const aniValue = event.ani;

      const params = {
        TableName: 'Verint', // Replace with your actual table name
        KeyConditionExpression: 'ani = :aniValue',
        ExpressionAttributeValues: {
          ':aniValue': aniValue
        }
      };

      const data = await dynamoDB.query(params).promise();

      if (data.Items.length === 0) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "No records found for the specified ani" })
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Records retrieved successfully",
          data: data.Items
        })
      };

    } catch (error) {
      console.error('Error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal server error", error: error.message })
      };
    }
  }

  async function searchByPhoneAndDateRange(event) {
    try {
      // Validate input
      if (!event.ani || !event.startDate || !event.endDate) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Missing 'ani', 'startDate', or 'endDate' parameter in query string" })
        };
      }

      const aniValue = event.ani;
      const startDate = `${event.startDate}T00:00:00.000`; // e.g., "2025-01-01T00:00:00Z"
      const endDate = `${event.endDate}T23:59:000`;     // e.g., "2025-01-31T23:59:59Z"

      const params = {
        TableName: 'Verint', // Replace with your actual table name
        KeyConditionExpression: 'ani = :aniValue AND audiostarttime BETWEEN :startDate AND :endDate',
        ExpressionAttributeValues: {
          ':aniValue': aniValue,
          ':startDate': startDate,
          ':endDate': endDate
        }
      };

      const data = await dynamoDB.query(params).promise();

      if (!data.Items || data.Items.length === 0) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "No records found for the specified ani and date range" })
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Records retrieved successfully",
          data: data.Items
        })
      };

    } catch (error) {
      console.error('Error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal server error", error: error.message })
      };
    }
  }

  async function generatePresignedUrl() {
    const bucketName = 'projectsp-poc-verint'; // Replace with your bucket name
    const objectKey = `recordings/${event.filename}`; // Replace with your file name
    const expirationTimeInSeconds = 15 * 60; // 15 minutes

    const params = {
      Bucket: bucketName,
      Key: objectKey,
      Expires: expirationTimeInSeconds, // Time in seconds
    };

    try {
      // Generate the presigned URL
      const url = await s3.getSignedUrlPromise('getObject', params);
      console.log('Presigned URL:', url);
      return url;
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      throw error;
    }
  }

  async function searchDateRange(event) {
      try {
        // Validate input
        if (!event.startDate || !event.endDate) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing 'startDate' or 'endDate' parameter in query string" })
          };
        }
    
        const startDate = `${event.startDate}T00:00:00.000Z`; // Start of the day in ISO 8601 format
        const endDate = `${event.endDate}T23:59:59.999Z`;     // End of the day in ISO 8601 format
    
        const params = {
          TableName: 'Verint', // Replace with your actual table name
          FilterExpression: 'audiostarttime BETWEEN :startDate AND :endDate',
          ExpressionAttributeValues: {
            ':startDate': startDate,
            ':endDate': endDate
          }
        };
    console.log(params)
        let items = [];
        let lastEvaluatedKey;
    
        do {
          // Add pagination support using LastEvaluatedKey
          if (lastEvaluatedKey) {
            params.ExclusiveStartKey = lastEvaluatedKey;
          }
    
          const data = await dynamoDB.scan(params).promise();
          items = items.concat(data.Items); // Append results to the items array
          lastEvaluatedKey = data.LastEvaluatedKey; // Update the LastEvaluatedKey for pagination
        } while (lastEvaluatedKey);
    
        if (items.length === 0) {
          return {
            statusCode: 404,
            body: JSON.stringify({ message: "No records found for the specified date range" })
          };
        }
    
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: "Records retrieved successfully",
            data: items
          })
        };
    
      } catch (error) {
        console.error('Error:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Internal server error", error: error.message })
        };
      }
    }
    

  

};
