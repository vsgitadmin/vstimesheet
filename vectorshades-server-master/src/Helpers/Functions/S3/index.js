const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  BUCKET_NAME,
  AWS_REGION,
  S3_PRESIGN_GET_EXPIRES,
} = process.env;

const region = AWS_REGION || 'ap-south-1';

function getS3() {
  return new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region,
    signatureVersion: 'v4',
  });
}

/**
 * Accepts an S3 object key or a full S3 / HTTPS URL and returns the object key.
 */
function s3KeyFromLocationOrKey(input) {
  if (input == null || typeof input !== 'string') return input;
  const trimmed = input.trim();
  if (!trimmed.startsWith('http')) return trimmed.replace(/^\/+/, '');
  try {
    const u = new URL(trimmed.split('?')[0]);
    const pathname = u.pathname.replace(/^\/+/, '');
    const host = u.hostname;
    const vh = host.match(/^(.+)\.s3[.-]([a-z0-9-]+)\.amazonaws\.com$/i);
    if (vh) return decodeURIComponent(pathname);
    const pathStyle = /^s3[.-]([a-z0-9-]+)\.amazonaws\.com$/i.test(host);
    if (pathStyle && pathname.includes('/')) {
      const parts = pathname.split('/');
      parts.shift();
      return decodeURIComponent(parts.join('/'));
    }
    return decodeURIComponent(pathname);
  } catch {
    return trimmed;
  }
}

function getPresignedGetUrl(keyOrUrl, expiresInSeconds) {
  const key = s3KeyFromLocationOrKey(keyOrUrl);
  const expires = Number(expiresInSeconds || S3_PRESIGN_GET_EXPIRES || 3600);
  const s3 = getS3();
  return s3.getSignedUrl('getObject', {
    Bucket: BUCKET_NAME,
    Key: key,
    Expires: expires,
  });
}

const readFile = async (filePath) => {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    return data;
  } catch (err) {
    console.log(err);
  }
};

const uploadCloudS3Document = async (localPath, fileName) => {
  const file = await readFile(localPath);
  const s3 = getS3();
  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: file,
  };
  const fileData = await s3.upload(uploadParams).promise();
  return fileData;
};

async function uploadExcelToS3(localFilePath, s3Key) {
  const fullPath = path.resolve(localFilePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath}`);
  }

  const fileStream = fs.createReadStream(fullPath);
  fileStream.on('error', (err) => {
    throw new Error(`File stream error: ${err.message}`);
  });

  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: s3Key,
    Body: fileStream,
    ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };

  const s3 = getS3();

  const result = await s3.upload(uploadParams).promise();
  console.log(`✅ Upload successful: ${result.Key}`);
  return result;
}

const deleteS3Document = async (file) => {
  try {
    const s3 = getS3();
    const Key = s3KeyFromLocationOrKey(file);
    const deleteParams = {
      Bucket: BUCKET_NAME,
      Key,
    };
    const fileData = await s3.deleteObject(deleteParams).promise();
    return fileData;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  uploadCloudS3Document,
  deleteS3Document,
  uploadExcelToS3,
  getS3,
  s3KeyFromLocationOrKey,
  getPresignedGetUrl,
};
