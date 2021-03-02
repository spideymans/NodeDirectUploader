# World Clock
World Clock: Users can use this application to get the time in any timezone, anywhere in the world. Users can also send the current time to their friends via SMS.

## Features

-   The timezone of the client is automatically generated and their current time is printed on the webpage.
    
-   Users can see a list of all available time zones available via the WorldTime API. This list is populated directly with data from WorldTime API.
    
-   Users can view the current time in any timezone.
    
-   Users can send the current time to any phone number via SMS.
    

## Architecture and Implementation Details

The webpage is a basic HTML and JS page. No major frameworks, other than JQuery, were used. Upon first load, the webpage will contact the WordTime API to get a list of available timezones to present to the user.

  

The server runs on Node JS, and it includes the twilio package to handle SMS. When HTTP GET requests are sent to the /time-sms endpoint, the server will fetch the current time using the WorldTime API, and send that to the user via SMS.

  

Please see the code for additional documentation.

## Running the Application
To run the application, simply navigate to [this address](https://agile-eyrie-28286.herokuapp.com).
Note that due to limitation of the Twilio API, you will be unable to specify a number to send SMS messages to. Twilio permits accounts to send SMS message to only one predefined SMS number during the trial period. More details are provided in the written report.