const AWS = require("aws-sdk");
const polly = new AWS.Polly({ region: "ap-southeast-1" });
const presigner = new AWS.Polly.Presigner({ service: polly });
var dynamodb = new AWS.DynamoDB();

exports.handler = async (event, context) => {
  console.log(event);
  switch (event.action) {
    case 'getList':
      const listParams = {};
      try {
        const data = await polly.describeVoices(listParams).promise();
        return {
          statusCode: 200,
          body: JSON.stringify(data)
        };
      }
      catch (err) {
        console.error(err, err.stack); // an error occurred
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "An error occurred while describing voices." })
        };
      }
    case 'generateSpeech':
      const speechParams = {
        OutputFormat: "mp3",
        SampleRate: "8000",
        Text: event.text,
        TextType: event.textType,
        Engine: event.engine,
        VoiceId: event.voice
      };
      try {
        const presignedUrl = await presigner.getSynthesizeSpeechUrl(speechParams, 600); //

        return presignedUrl;
      }
      catch (err) {
        console.error(err, err.stack); // an error occurred
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "An error occurred while describing voices." })
        };
      }
    case 'getHolidays':

      var holidayParams = {
        Key: {
          "country": {
            S: event.country
          }
        },
        TableName: "audit"
      };
      dynamodb.getItem(holidayParams, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data); // successful response
        /*
        data = {
         Item: {
          "AlbumTitle": {
            S: "Songs About Life"
           }, 
          "Artist": {
            S: "Acme Band"
           }, 
          "SongTitle": {
            S: "Happy Day"
           }
         }
        }
        */
      });
    default:
  }
};
