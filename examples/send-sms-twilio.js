import config from '../app/config.js'

const accountSid = config.twilio_accountSid;
const authToken = config.twilio_authToken;

import twilio from 'twilio'
const client = twilio(accountSid, authToken);

client.messages
  .create({
    body: 'temporarily pacify this hungering',
    from: config.twilio_smsFrom,
    to: config.twilio_smsTo
  })
  .then(message => console.log(message.sid));

