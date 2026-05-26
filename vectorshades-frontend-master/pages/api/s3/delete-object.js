import { getBucket, getS3, resolveS3KeyFromInput } from "./s3Util";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { key } = req.body || {};
    if (!key) {
      res.status(400).json({ error: "Missing `key`" });
      return;
    }

    const bucket = getBucket();
    const s3Key = resolveS3KeyFromInput(key, bucket);
    if (!s3Key) {
      res.status(400).json({ error: "Invalid key" });
      return;
    }

    const s3 = getS3();

    const result = await s3
      .deleteObject({
        Bucket: bucket,
        Key: s3Key,
      })
      .promise();

    res.status(200).json({ ok: true, result });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
