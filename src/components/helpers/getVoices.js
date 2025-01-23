const AWS = require('aws-sdk');
const polly = new AWS.Polly({region: "ap-southeast-1"});

AWS.config.update({
  region: "ap-southeast-1",
  accessKeyId: "AKIAZI2LJGMREPUD46WQ",
  secretAccessKey: "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"
});

const getVoices = async (newText, newVoice, newLanguage, region, callback) => {
  AWS.config.update({
    region: "ap-southeast-1",
    accessKeyId: "AKIAZI2LJGMREPUD46WQ",
    secretAccessKey: "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"
  });
  const params = {
  };
  await polly.describeVoices(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
      let languageCodes = [];
        for (var i = data.Voices.length; i--;) {
          if(languageCodes.indexOf(data.Voices[i].LanguageCode) === -1){
            languageCodes.push(data.Voices[i].LanguageCode)
          }
        }
        languageCodes.sort();
        return languageCodes;
    };
  });
}
module.exports = { getVoices };


