import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  base_url: process.env.BASE_URL,
  ai_base_url: process.env.AI_BASE_URL,
  backend_base_url: process.env.BACKEND_BASE_URL,
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || "12",
  otp_expiry_time: process.env.OTP_ACCESS_EXPIRES_IN || "5",
  image_url: process.env.IMAGE_URL,
  environment: process.env.ENVIRONMENT,
  smtp: {
    email: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
    email_from: process.env.SMTP_EMAIL_FROM,
    host: process.env.SMTP_HOST,
    name: process.env.SMTP_NAME,
    port: process.env.SMTP_PORT,
  },
  radis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
  },
  super_admin: {
    email: process.env.SUPER_ADMIN_EMAIL,
    password: process.env.SUPER_ADMIN_PASSWORD
  },
  hyzine: {
    client_id: process.env.HEYZINE_CLIENT_ID,
    api_key: process.env.HEYZINE_API_KEY
  },
  jwt: {
    access_secret: process.env.JWT_SECRET,
    gen_salt: process.env.GEN_SALT,
    access_expires_in: process.env.EXPIRES_IN,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
    reset_pass_secret: process.env.RESET_PASS_TOKEN,
    reset_pass_token_expires_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN,
  },
  reset_pass_link: process.env.RESET_PASS_LINK,
  emailSender: {
    email: process.env.EMAIL,
    app_pass: process.env.EMAIL_PASSWORD,
  },
  stripe: {
    secret_key: process.env.STRIPE_SECRET_KEY,
    publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
    webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  sendEmail: {
    email_from: process.env.EMAIL_FROM,
    brevo_pass: process.env.BREVO_PASS,
    brevo_email: process.env.BREVO_EMAIL,
  },
  S3: {
    accessKeyId: process.env.S3_ACCESS_KEY || "DO002RGDJ947DJHJ9WDT",
    secretAccessKey:
      process.env.S3_SECRET_KEY ||
      "e5+/pko6Ojar51Hb8ojUKfq2HtXy+tnGKOfs3rIcEfo",
    region: process.env.S3_REGION || "nyc3",
    bucketName: process.env.S3_BUCKET_NAME || "smtech-space",
    endpoint: process.env.S3_ENDPOINT,
  },

};
