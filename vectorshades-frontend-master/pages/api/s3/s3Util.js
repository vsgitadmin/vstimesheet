import AWS from "aws-sdk";

export const getBucket = () => process.env.S3_BUCKET_NAME || "vectorshades-dev";

export function getS3() {
  const region = process.env.AWS_REGION || "us-east-1";
  return new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region,
  });
}

/**
 * Accepts an S3 object key or a legacy public object URL and returns the key to use with GetObject/PutObject.
 */
export function resolveS3KeyFromInput(input, bucketName) {
  if (input == null || typeof input !== "string") return null;
  const s = input.trim();
  if (!s) return null;

  if (s.startsWith("http://") || s.startsWith("https://")) {
    try {
      const u = new URL(s);
      const host = u.hostname;
      if (host.includes(".s3.") && host.endsWith(".amazonaws.com")) {
        let path = decodeURIComponent(u.pathname || "");
        path = path.replace(/^\/+/, "");
        return path || null;
      }
      if (host.startsWith("s3.")) {
        const segments = u.pathname.replace(/^\//, "").split("/");
        if (segments[0] === bucketName) {
          return decodeURIComponent(segments.slice(1).join("/")) || null;
        }
      }
      let path = decodeURIComponent(u.pathname || "").replace(/^\/+/, "");
      return path || null;
    } catch {
      return s;
    }
  }

  return s;
}
