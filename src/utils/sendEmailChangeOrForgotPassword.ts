require("dotenv").config();
import nodeMailer from "nodemailer";
import { Options } from "nodemailer/lib/mailer";

export const sendEmail = async (options: any) => {
  let testAccount = await nodeMailer.createTestAccount();

  const transporter = await nodeMailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions: Options = {
    from: "hosybinhkog@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.message,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodeMailer.getTestMessageUrl(info));
};
