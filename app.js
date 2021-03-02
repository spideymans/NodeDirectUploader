/*
 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/


/*
 * Import required packages.
 * Packages should be installed with "npm install".
 */
const express = require('express');
const aws = require('aws-sdk');

/**
 * Loads .env if not in production
 */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

/**
 * Import required packages and environment vars for Twilio.
 */
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

console.log("Sending message")
sendTime()

function sendTime() { 
  // var client = new HttpClient();
  // client.get(`http://worldtimeapi.org/api/timezone/America/Toronto`, function (response) {
  //   response = JSON.parse(response)
  //   console.log(response.datetime)
  // });

  require('http').get('http://worldtimeapi.org/api/timezone/America/Toronto', (res) => {
    res.setEncoding('utf8');
    res.on('data', function (body) {
      const data = JSON.parse(body)
        console.log(data);
        client.messages
          .create({
            body: `The time in Toronto is: ${data.datetime}`,
            from: `+${process.env.TWILIO_PHONE}`,
            to: `+${process.env.DESTINATION_PHONE}`
          })
          .then(message => console.log(message.sid));

    });
});
}

/*
 * Set-up and run the Express app.
 */
const app = express();
app.set('views', './views');
app.use(express.static('./public'));
app.engine('html', require('ejs').renderFile);
app.listen(process.env.PORT || 3000);

/*
 * Configure the AWS region of the target bucket.
 * Remember to change this to the relevant region.
 */
aws.config.region = 'us-east-2';

/*
 * Load the S3 information from the environment variables.
 */
const S3_BUCKET = process.env.S3_BUCKET;

/*
 * Respond to GET requests to /account.
 * Upon request, render the 'account.html' web page in views/ directory.
 */
app.get('/account', (req, res) => res.render('account.html'));

/*
 * Respond to GET requests to /sign-s3.
 * Upon request, return JSON containing the temporarily-signed S3 request and
 * the anticipated URL of the image.
 */
app.get('/sign-s3', (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

/*
 * Respond to POST requests to /submit_form.
 * This function needs to be completed to handle the information in
 * a way that suits your application.
 */
app.post('/save-details', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify("File Uploaded Successfuly"));
});
