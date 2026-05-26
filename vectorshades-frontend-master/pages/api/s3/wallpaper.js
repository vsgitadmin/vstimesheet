import { getBucket, getS3 } from "./s3Util";

/**
 * GET — redirects to a short-lived presigned URL for the login wallpaper (CSS background).
 * Override key with S3_WALLPAPER_KEY in env if needed.
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const bucket = getBucket();
    const key = process.env.S3_WALLPAPER_KEY || "wallpaper.jpeg";
    const s3 = getS3();
    const url = await s3.getSignedUrlPromise("getObject", {
      Bucket: bucket,
      Key: key,
      Expires: 300,
    });
    res.redirect(302, url);
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
