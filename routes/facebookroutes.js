var express = require('express');
var router = express.Router();
const request = require('request');
/* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === 'EAALVRSgCciABACUjdClcJv3TWD5sjD6CYZADhx0Kl1DvphsZB0tYBlbFtxweiPmaRadZCrjzpvgSrE4eZAqtpt2teZC4qNgPG8xB4MsG3NmZAZC8YyZATFHxvdO6SIlLEwrIDlYgcjAiOKuJ6uVtlWW3OIsXwj9UiAccoRf6AyW6FXtRZBx3UqQKSnGTS6dPZBojgZD') {
    console.log('webhook verified');
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error('verification failed. Token mismatch.');
    res.sendStatus(403);
  }
});
router.post('/webhook', function (req, res) {
  //checking for page subscription.
  if (req.body.object === 'page') {
    /* Iterate over each entry, there can be multiple entries 
    if callbacks are batched. */
    req.body.entry.forEach(function (entry) {
      // Iterate over each messaging event
      entry.messaging.forEach(function (event) {
        console.log(event);
        let sender_psid = event.sender.id;
        if (event.postback) {
          // processPostback(event);
        //   handlePostback(sender_psid, event.postback);
        } else if (event.message) {
          // processMessage(event);
        //   handleMessage(sender_psid, event.message);
        }
      });
    });
    res.sendStatus(200);
  }
});

// Handles messages events
function handleMessage(sender_psid, received_message) {
  let response;

  // Checks if the message contains text
  if (received_message.text) {
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
    }
  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the right picture?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes!",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }
            ],
          }]
        }
      }
    }
  }

  // Send the response message
  callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "Thanks!" }
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v8.0/me/messages",
    "qs": { "access_token": 'EAALN9e2wp0wBAMgUcCMSJk19KyTLhYDLKkDUNW9JsvYa3c3QpNm7YfEYNt1pZBio5s6LakvIZBpwnmDpSoSQSKsZC4sI4RubZCKPTzr8xBnIReTa4TZCRLZC0J70QRlqo1avXxZAm5lTcHpRS2xvMkZCzzA2wksDiRFV095ZAPqHVDD93kJM7mACq' },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}

module.exports = router;
