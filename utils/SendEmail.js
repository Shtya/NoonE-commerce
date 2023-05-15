const nodemailer = require("nodemailer")
const {Email , Password} = process.env
const SendEmail = async(option)=>{
    
    const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:465,
        secure:true,
        auth:{
            user:Email,
            pass : Password
        }
    })

    const mailOptions  = {
        from : "E-shop App <Shtya@gmail.com>",
        to : option.email,
        subject : option.subject,
        text : option.message
    }

    await transporter.sendMail(mailOptions)
}

module.exports = SendEmail