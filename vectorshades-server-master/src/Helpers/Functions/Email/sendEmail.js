const nodemailer = require('nodemailer');
const DEFAULT_EMAIL = process.env.EMAIL || '';
const DEFAULT_EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || '';

// SMTP settings:
// - Defaults to the Office365 configuration currently used elsewhere in this repo.
// - You can override all values via environment variables.
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.office365.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const parseBool = (value) => {
  if (value === true) return true;
  if (value === false) return false;
  if (typeof value !== 'string') return false;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'y') return true;
  if (normalized === 'false' || normalized === '0' || normalized === 'no' || normalized === 'n') return false;
  return false;
};

const rawSmtpSecure = process.env.SMTP_SECURE;
const SMTP_SECURE_RAW_SET = typeof rawSmtpSecure !== 'undefined' && String(rawSmtpSecure).trim() !== '';
let SMTP_SECURE = SMTP_SECURE_RAW_SET ? parseBool(rawSmtpSecure) : SMTP_PORT === 465;

const SMTP_USER = process.env.SMTP_USER || DEFAULT_EMAIL;
const SMTP_PASS = process.env.SMTP_PASS || DEFAULT_EMAIL_PASSWORD;

const FROM_NAME = process.env.SMTP_FROM_NAME || 'Vectorshades Management';
const FROM_EMAIL = process.env.SMTP_FROM_EMAIL || SMTP_USER || DEFAULT_EMAIL;

const EMAIL_DEBUG = process.env.EMAIL_DEBUG === 'true' || process.env.EMAIL_DEBUG === true;

const logSmtpConfig = () => {
  if (!EMAIL_DEBUG) return;

  const env = {
    SMTP_HOST: typeof process.env.SMTP_HOST !== 'undefined',
    SMTP_PORT: typeof process.env.SMTP_PORT !== 'undefined',
    SMTP_SECURE: typeof process.env.SMTP_SECURE !== 'undefined',
    SMTP_USER: typeof process.env.SMTP_USER !== 'undefined',
    SMTP_PASS: typeof process.env.SMTP_PASS !== 'undefined',
    SMTP_FROM_EMAIL: typeof process.env.SMTP_FROM_EMAIL !== 'undefined',
    SMTP_FROM_NAME: typeof process.env.SMTP_FROM_NAME !== 'undefined',
  };

  // Intentionally do NOT log SMTP_PASS.
  console.log('[email] SMTP config debug:', {
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    user: SMTP_USER,
    fromEmail: FROM_EMAIL,
    fromName: FROM_NAME,
    envOverrides: env,
  });
};

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

const normalizeMailOptions = ({ to, subject, html }) => {
  if (typeof to !== 'string' || !to.trim()) throw new Error('Missing or invalid "to" email');
  if (typeof subject !== 'string' || !subject.trim()) throw new Error('Missing or invalid "subject"');
  if (typeof html !== 'string' || !html.trim()) throw new Error('Missing or invalid "html" content');

  return {
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to,
    subject,
    html,
  };
};

const sendEmail = async (to, subject, html) => {
  const mailOptions = normalizeMailOptions({ to, subject, html });

  try {
    logSmtpConfig();
    // nodemailer returns an info object: { messageId, response, ... }
    return await transporter.sendMail(mailOptions);
  } catch (err) {
    if (EMAIL_DEBUG) {
      console.log('[email] sendMail failed:', {
        message: err && err.message,
        code: err && err.code,
        response: err && err.response,
      });
    }
    throw new Error(`Failed to send email: ${err && err.message ? err.message : String(err)}`);
  }
};

module.exports = sendEmail;
