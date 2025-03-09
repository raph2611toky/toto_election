require('dotenv').config()
const client_twilio = require('twilio')

const accountSid = process.env.ACCOUNT_SID_TWILIO;
const authToken = process.env.AUTHTOKEN_TWILIO;
const sender_number_twilio = process.env.NUMBER_TWILIO_SENDER;
const verify_service_sid = process.env.VERIFY_SERVICE_SID;

async function sendSms(phone_number,message){
    const client = await client_twilio(accountSid, authToken);
    client.messages
        .create({
            from: sender_number_twilio,
            to: phone_number,
            body: message
        })
        .then(message => console.log(message.sid));
}

async function send_verification(phoneNumber){
    try {
        const client = await client_twilio(accountSid, authToken);
        client.verify.v2.services(verify_service_sid)
            .verifications
            .create({to: phoneNumber, channel: 'sms'})
            .then(verification => console.log(verification.status))
            .catch(e => console.log(e));
        return true
    }catch (e){
        console.log(e);
        return false        
    }
}

async function verify_otp(phoneNumber, code){
    try {
        const client = await client_twilio(accountSid, authToken);
        client.verify.v2.services(verify_service_sid)
            .verificationChecks
            .create({to: phoneNumber, code})
            .then(verification_check => console.log(verification_check.status))
            .catch(e => console.log(e));
        return true
    }catch(e){
        return false
    }
}


module.exports = { sendSms, send_verification, verify_otp }