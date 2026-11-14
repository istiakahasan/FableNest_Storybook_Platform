import nodemailer from "nodemailer";
import config from "../../config";
import prisma from "../lib/prisma";

export const sendSupportMail = async (payload: {
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
}) => {
  const { fullName, email, phoneNumber, message } = payload;

  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: false,
    auth: {
      user: config.smtp.email,
      pass: config.smtp.pass,
    },
  } as any);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  const html = `
  <div style="max-width: 650px; margin: 0 auto; background-color: #f8fafc; border-radius: 8px; padding: 24px; font-family: Arial, sans-serif;">
    
    <div style="text-align: center; margin-bottom: 24px;">
      <img 
        src="https://res.cloudinary.com/shariful10/image/upload/v1749700233/yldrmw7kojhei2lddt8k.png"
        alt="Logo"
        style="height: 40px;"
      />
    </div>

    <h2 style="color: #0f172a; text-align: center;">
      📩 New Support Request
    </h2>

    <p style="text-align: center; color: #64748b;">
      Submitted on ${formattedDate}
    </p>

    <table style="width: 100%; margin-top: 24px; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px; font-weight: bold;">Full Name</td>
        <td style="padding: 10px;">${fullName}</td>
      </tr>
      <tr style="background-color: #f1f5f9;">
        <td style="padding: 10px; font-weight: bold;">Email</td>
        <td style="padding: 10px;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: bold;">Phone Number</td>
        <td style="padding: 10px;">${phoneNumber}</td>
      </tr>
      <tr style="background-color: #f1f5f9;">
        <td style="padding: 10px; font-weight: bold;">Message</td>
        <td style="padding: 10px; white-space: pre-line;">
          ${message}
        </td>
      </tr>
    </table>

    <p style="margin-top: 24px; color: #475569; font-size: 14px;">
      Please respond to the user as soon as possible.
    </p>
  </div>
  `;

  const staticConfig = await prisma.staticConfig.findFirst({ where: { isActive: true } });
  return transporter.sendMail({
    from: `${config.smtp.name} <${config.smtp.email_from}>`,
    to: staticConfig?.supportMail, // 👉 support inbox
    replyTo: email, // reply goes to user
    subject: `📨 Support Request from ${fullName}`,
    html,
  });
};
