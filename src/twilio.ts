import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } from './config/keys'

const accountSid = TWILIO_ACCOUNT_SID
const authToken = TWILIO_AUTH_TOKEN

export const sendSms = (phone: any, message: any) => {
    const client = require('twilio')(accountSid, authToken)
    client.messages
        .create({
            body: message,
            from: TWILIO_PHONE_NUMBER,
            to: phone
        })
        .then((message: any) => console.log(message.sid))
} 
