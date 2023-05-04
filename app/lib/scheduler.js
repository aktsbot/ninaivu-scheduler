import axios from "axios"
import Scheduler from "../models/scheduler.model.js";

import config from "../config.js"

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

export const updateLastRun = async function() {
  try {
    const date = new Date();

    await Scheduler.updateOne({}, {
      $set: {
        ranOn: date
      }
    })
    return
  } catch (error) {
    console.log(error)
  }
}

export const updateCreditsRemaining = async function() {
  try {
    const resp = await getCredits();
    // console.log(resp.data)

    await Scheduler.updateOne({}, {
      $set: {
        credits: resp.data.balance
      }
    })
    return
  } catch (error) {
    console.log(error)
  }
}
