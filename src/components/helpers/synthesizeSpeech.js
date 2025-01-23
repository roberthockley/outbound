const AWS = require('aws-sdk');
const polly = new AWS.Polly({region: "ap-southeast-1"});

AWS.config.update({
  region: "ap-southeast-1",
  accessKeyId: "AKIAZI2LJGMREPUD46WQ",
  secretAccessKey: "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"
});

const synthesizeSpeech = async (newText, newVoice, newLanguage, region, callback) => {
  AWS.config.update({
    region: "ap-southeast-1",
    accessKeyId: "AKIAZI2LJGMREPUD46WQ",
    secretAccessKey: "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"
  });
  const params = {
  };
  await polly.describeVoices(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data);
  });
}
module.exports = { synthesizeSpeech };
