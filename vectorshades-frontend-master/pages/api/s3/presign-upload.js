import { getBucket, getS3 } from "./s3Util";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { key, contentType } = req.body || {};
    if (!key) {
      res.status(400).json({ error: "Missing `key`" });
      return;
    }

    const bucket = getBucket();
    const s3 = getS3();

    const params = {
      Bucket: bucket,
      Key: key,
      ContentType: contentType || undefined,
    };

    const uploadUrl = await s3.getSignedUrlPromise("putObject", {
      ...params,
      Expires: 60 * 5,
    });

    // Object key only — bucket is private; use /api/s3/presign-get for reads.
    const location = key;

    res.status(200).json({ uploadUrl, location, Location: location, key });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
