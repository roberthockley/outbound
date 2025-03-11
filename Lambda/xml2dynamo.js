const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB.DocumentClient();
const xml2js = require('xml2js');

const parser = new xml2js.Parser({
    explicitArray: false,
    explicitCharkey: true,
    ignoreAttrs: false,
    mergeAttrs: true,
    xmlns: true
});

exports.handler = async (event) => {
    try {
        // 1. S3 File Retrieval
        const bucket = event.Records[0].s3.bucket.name;
        const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
        const s3Object = await s3.getObject({ Bucket: bucket, Key: key }).promise();
        const xmlContent = s3Object.Body.toString('utf-8');

        // 2. XML Parsing (Main Document)
        const parsedData = await parser.parseStringPromise(xmlContent);

        let pData = parsedData['pkg:package']['pkg:part'][1]['pkg:xmlData']['w:document']['w:body']['w:p']
        let dataToUpload = []
        let item = {}
        for (let i = 0; i < Object.values(pData).length; i++) {
            let newLength = Object.values(pData)[i]?.['w:r'] || 0;
            if (newLength) {
                for (let j = 0; j < newLength.length; j++) {
                    let newestLength = Object.values(newLength[j]['w:t'])
                    for (let l = 0; l < newestLength.length; l++) {
                        let dataToCheck = newestLength[l].toString()
                        const regex1 = /x:ctiseen="true".*?x:id="(\d+)"/;
                        const match1 = dataToCheck.match(regex1);
                        if (match1) {
                            console.log(`Extracted ID: ${match1[1]}`);
                            item.filename = `${match1[1]}.wav`
                        }
                        if (dataToCheck.includes("x:key=")) {
                            let details = {}
                            const regex2 = /x:key="([^"]+)"\s*>\s*([^<]+)</;
                            const match2 = dataToCheck.match(regex2);
                            if (match2) {
                                details[match2[1]] = match2[2];
                            }
                            dataToUpload.push(details)
                        }

                    }

                }
            }

        }

        // 8. DynamoDB Upload
        
        for (let i = 0; i < dataToUpload.length; i++) {
            let dd = JSON.parse(JSON.stringify(Object.values(dataToUpload)[i]))
            console.log(dd, Object.keys(dd))
            if (Object.keys(dd) == "ani") {
                item.ani = Object.values(dd)[0]
            } else {
                item[Object.keys(dd)] = Object.values(dd)[0]
            }

        }


        const dbParams = {
            TableName: 'Verint',
            Item: item
        };
        console.log(dbParams)
        await dynamodb.put(dbParams).promise();
        return { status: 'Metadata processed successfully' };

    } catch (error) {
        console.error('Processing error:', error);
        throw new Error(`Metadata processing failed: ${error.message}`);
    }
};
