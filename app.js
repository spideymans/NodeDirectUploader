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
 * Respond to GET requests to /.
 * Upon request, render the 'main.html' web page in views/ directory.
 */
app.get('/', (req, res) => res.render('main.html'));

app.get('/time-sms', (req, res) => {
  var timezone = req.query.timezone;
  console.log(timezone)
  sendTime(timezone)
  res.end()
});


/**
* Sends time via SMS to the default number. 
* Note: Twilio trial can only send messages to a single, predefined phone number. 
* Users will not be able to send SMS to arbirary phone numbers until we upgrade form Twilio trial.
* @param {*} timezone Timezone name provided by WorldTimeAPI (string)
*/
function sendTime(timezone) {
  require('http').get(`http://worldtimeapi.org/api/timezone/${timezone}`, (res) => {
    res.setEncoding('utf8');
    res.on('data', function (body) {
      const data = JSON.parse(body)
      console.log(data);
      client.messages
        .create({
          body: `The time in ${timezone} is: ${data.datetime}`,
          from: `+${process.env.TWILIO_PHONE}`,
          to: `+${process.env.DESTINATION_PHONE}`
        })
        .then(message => console.log(message.sid));

    });
  });
}