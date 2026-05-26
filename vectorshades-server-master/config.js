const MONGODBSRV = process.env.MONGODBSRV;
const JWT_SECRET = process.env.JWT_SECRET;
const FILE_SERVER = process.env.FILE_SERVER || 'http://localhost:50000/';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:50000/';
const EMAIL = process.env.EMAIL || process.env.SMTP_USER || '';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || process.env.SMTP_PASS || '';
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';
const port = Number(process.env.PORT || 50000);

module.exports = {
  MONGODBSRV,
  JWT_SECRET,
  FILE_SERVER,
  BACKEND_URL,
  port,
  EMAIL,
  EMAIL_PASSWORD,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
};
