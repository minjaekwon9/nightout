import twilio from 'twilio'

export default function sendSMS(req, res) {
    const { phoneNum, msg } = req.body
    const client = twilio(process.env.NEXT_PUBLIC_TWILIO_SID, process.env.NEXT_PUBLIC_TWILIO_TOKEN)
    client.messages
        .create({
            body: msg,
            from: '(408) 692-9593',
            to: phoneNum,
        })
        .then(() => {
            res.json({
                status: 200,
            })
        }
        )
        .catch((error) => {
            console.log(error);
            res.json({
                status: error,
            })
        })
}
