import axios from "axios";
import config from "../app/config.js"

const accountSid = config.twilio_accountSid;
const authToken = config.twilio_authToken;

function getCredits() {
  return axios.get(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Balance.json`, {
    auth: {
      username: accountSid,
      password: authToken
    }
  })
}

async function start() {
  try {
    const resp = await getCredits();
    console.log(resp.data)
  } catch (error) {
    console.error(error)
  }
}

start()
