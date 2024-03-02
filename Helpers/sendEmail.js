const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const sendMail = async(email, subject, body) =>{
    try {
        const mailOptions = {
            from : `"${process.env.EMAIL_NAME}" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: subject,
            html: body
        }
        const sendingEmail = await transporter.sendMail(mailOptions)
        return sendingEmail
    } catch (error) {
        console.log(error);
        return false
    }
}

module.exports = { sendMail }