import axios from 'axios';

import config from '../app/config.js'

function sendSMS() {
  let sender = encodeURIComponent('TXTLCL');
  let encoded_message = encodeURIComponent('Testing SMS with textlocal.in');

  return axios.post('https://api.textlocal.in/send/', {
    'apikey': config.sms_api_key,
    'numbers': '##replace_me##',
    'message': encoded_message,
    'sender': sender
  })
}

async function start() {
  try {
    const resp = await sendSMS();
    console.log(resp.data);
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()
