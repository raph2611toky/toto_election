require("dotenv").config()

async function sendWhatshapp(to_number, body_message){
    const accountSid = process.env.ACCOUNT_SID_TWILIO;
    const authToken = process.env.AUTHTOKEN_TWILIO;
    const sender_number_twilio = process.env.NUMBER_TWILIO_SENDER;
    const client = require('twilio')(accountSid, authToken);
    try {
        const message = await client.messages.create({
            body: body_message,
            from: 'whatsapp:' + sender_number_twilio,
            to: 'whatsapp:' + to_number
        });
        console.log("Whatsapp notification reussi.", message.sid);
        return true;
    }catch (e){
        console.log(e);
        return false
    }
}

module.exports = { sendWhatshapp }