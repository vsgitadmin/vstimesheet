import { getBucket, getS3, resolveS3KeyFromInput } from "./s3Util";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { key, expiresIn } = req.body || {};
    if (!key) {
      res.status(400).json({ error: "Missing `key`" });
      return;
    }

    const bucket = getBucket();
    const s3Key = resolveS3KeyFromInput(key, bucket)?.replace(/\/{2,}/g, "/");
    if (!s3Key) {
      res.status(400).json({ error: "Invalid key" });
      return;
    }

    const s3 = getS3();
    const sec = Math.min(Math.max(Number(expiresIn) || 3600, 60), 86400);

    const url = await s3.getSignedUrlPromise("getObject", {
      Bucket: bucket,
      Key: s3Key,
      Expires: sec,
    });

    res.status(200).json({ url });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
