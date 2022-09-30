require("dotenv").config();
import nodeMailer from "nodemailer";
import { Options } from "nodemailer/lib/mailer";

export const sendEmail = async (options: any) => {
  let testAccount = await nodeMailer.createTestAccount();

  const transporter = await nodeMailer.createTransport({
    host: "smtp.163.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions: Options = {
    from: process.env.USER_NODEMAILER || "hosybinhkog@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};
