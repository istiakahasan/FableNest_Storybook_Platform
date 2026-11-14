import nodemailer from "nodemailer";
import config from "../../config";

export const sendEMail = async (
  to: string,
  otp: number | string
) => {
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
  <div style="max-width: 600px; margin: 0 auto; background-color: #000721; border-radius: 8px; padding: 24px;">
    <table style="width: 100%;">
      <tr>
        <td style="text-align: center;">
          <img 
            src="https://res.cloudinary.com/shariful10/image/upload/v1749700233/yldrmw7kojhei2lddt8k.png"
            alt="Logo"
            style="height: 40px; margin-bottom: 16px;"
          />
        </td>
        <td style="text-align: right; color: #aaa; font-size: 12px;">
          ${formattedDate}
        </td>
      </tr>
    </table>

    <h2 style="text-align: center; color: #ffffff;">
      Verify Your OTP (Valid for 10 Minutes)
    </h2>

    <p style="text-align: center; color: #ffffff; font-size: 28px; letter-spacing: 4px; font-weight: bold;">
      ${otp}
    </p>

    <p style="text-align: center; color: #ccc; font-size: 14px;">
      Do not share this OTP with anyone.  
      If you didn’t request this, please ignore this email.
    </p>
  </div>
  `;

  return transporter.sendMail({
    from: `${config.smtp.name} <${config.smtp.email_from}>`,
    to,
    subject: "Your OTP Code (Valid for 10 Minutes)",
    html,
  });
};
