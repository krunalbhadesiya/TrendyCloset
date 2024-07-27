import nodemailer from "nodemailer";

const sendMail = async (to:any, subject:any, message:any) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: 465,
      secure: false,
      auth: {
        user: "lotusgroup.dev@gmail.com",
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: '"Lotus Group" <lotusgroup.dev@gmail.com>',
      to,
      subject,
      text: message,
      html: `<div>${message}</div>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendMail

// Example usage
// sendMail('test@ex.com', 'test', 'This is a test message');
