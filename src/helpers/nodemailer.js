const nodemailer = require("nodemailer");
const selectMessage = require("./generate-email-message");
const {parseNodemailError} = require("./handle-errors");
const {createLog} = require("./winston");

require('dotenv').config();

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    auth: {
      user: process.env.EMAIL_USERNAME, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
    secure: false,
    tls: {
      ciphers: 'SSLv3'
    }
});

module.exports = async (email, param, type, req) => {
    try {
        const message = selectMessage(param, type);
        await transporter.sendMail({
            from: process.env.EMAIL_USERNAME, // sender address
            to: email, // list of receivers
            subject: message.subject, // Subject line
            html: message.body
        });
        
        createLog('info', 'The mail was sended successfully', req)
    } catch (error) {
        parseNodemailError(error, req)
    }
}