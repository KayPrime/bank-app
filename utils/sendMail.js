import nodemailer from "nodemailer";

async function sendMail(email, subject, text, body) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.NODEMIALER_EMAIL,
      to: email,
      subject: subject,
      text,
      html: body,
      
    });

    console.log("message sent to client successfully");
  } catch (err) {
    console.log(err);
    console.log("mail not sent");
  }
}

export { sendMail };
