import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const config = {
  mongodb_uri: process.env.MONGODB_URI,
  sms_api_key: process.env.SMS_API_KEY,
  twilio_accountSid: process.env.TWILIO_ACCOUNT_SID,
  twilio_authToken: process.env.TWILIO_AUTH_TOKEN,
  twilio_smsFrom: process.env.TWILIO_SMS_FROM_NUMBER,
  twilio_smsTo: process.env.TWILIO_SMS_TO_NUMBER,
}


if (!config.sms_api_key) {
  console.error("No sms key found in env. Please set it!")
  process.exit(1)
}
export default config;
