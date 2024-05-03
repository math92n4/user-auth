import nodemailer from 'nodemailer'
import "dotenv/config";

export async function sendWelcome(email) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: process.env.ETHEREAL_USER,
            pass: process.env.ETHEREAL_PASS
        }
    })

    const msg = {
        from: "User Authentication",
        to: email,
        subject: "Welcome",
        text: `Welcome ${email}`   
    }

    const info = await transporter.sendMail(msg)
    console.log(info.messageId)
}



