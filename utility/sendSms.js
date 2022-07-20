const twilio = require('twilio')

const TWILIO_ACCOUNT_SID = "ACdbd24fd991a5a67ebf344c0e8d1c5307"
const TWILIO_AUTH_TOKEN = "6976df678effe097fbbe5933c815bfd5"
const TWILIO_SENDER_PHONE = "+17579971885"

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const send = async (phone, message) => {
    if (phone && message) {
        try {
            
            phone = '+919759297092'
            let SMSResponse = await client.messages.create({
                body: message,
                from: TWILIO_SENDER_PHONE,
                to: phone
            })
            if (SMSResponse) {
                console.log('SMS Success: ', SMSResponse.to, SMSResponse.body)
                return true
            }
        }
        catch (error) {
            console.log('SMS Error: ', phone, error.message, error)
            return false
        }
    } else {
        return false
    }
}

let SMS = {
    send
}


module.exports= SMS