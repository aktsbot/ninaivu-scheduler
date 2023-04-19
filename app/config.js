import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const config = {
  mongodb_uri: process.env.MONGODB_URI,
  sms_api_key: process.env.SMS_API_KEY
}


if (!config.sms_api_key) {
  console.error("No sms key found in env. Please set it!")
  process.exit(1)
}
export default config;
