const nodemailer = require("nodemailer");
const mailaddress =  require('./mailaddress.json')

async function sendMail(fixMsgDiff, userpassword){

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: `${mailaddress.sender}`,
          pass: mailaddress.passwd,
        },
      });

    await sendFixMsgDiff(fixMsgDiff,transporter)
    
}

async function sendFixMsgDiff(fixMsgDiff,transporter) {
  // send mail with defined transport object
  try {
    const info = await transporter.sendMail({
      from: `${mailaddress.sender}`, // sender address
      to: `${mailaddress.receivers}`, // list of receivers
      subject: "REDI vs TORA Fix Messages", // Subject line
      text: '', // plain text body
      html: fixMsgDiff, // html body
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log("***  Oops ! User name and password didn't match OR Allow less secure app feature is disbled. \n Please click here to see wheter it is enabled or not :  https://myaccount.google.com/u/0/lesssecureapps?pli=1&rapt=AEjHL4OXUaBuhMn_QfLt160TLf_P7dox4R6RL-BVtTZNe60DF4jlnSAtqsi91GogYicBLnGBcMPorrm-C_G8JLjL5fEh2RDu1MeOwpuHaFmr11Wx2douhcE  ***");
  }
  }

module.exports.sendMail = sendMail