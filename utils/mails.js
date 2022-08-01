const nodemailer = require("nodemailer");

const mailer=async(options)=>{
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});


    const message={
    from: 'help@thestore.com', // sender address
    to: options.to, // list of receivers
    subject: options.subject, // Subject line
    text: options.text, // plain text body
    
  }
     await transporter.sendMail(message);
}

module.exports=mailer