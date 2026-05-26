import { useEffect, useState } from "react";
import { presignGetUrl } from "../../Controllers/files/index";

/**
 * Resolves a stored S3 key or legacy public object URL to a short-lived presigned GET URL.
 */
export default function PresignedLink({ s3Ref, children, onClick, style, ...rest }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!s3Ref) return;
    let cancelled = false;
    presignGetUrl(s3Ref)
      .then((u) => {
        if (!cancelled) setUrl(u);
      })
      .catch(() => {
        if (!cancelled) setUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [s3Ref]);

  const handleClick = (e) => {
    if (!url) e.preventDefault();
    onClick?.(e);
  };

  if (!s3Ref) {
    return (
      <span style={style} {...rest}>
        {children}
      </span>
    );
  }

  return (
    <a
      {...rest}
      href={url || "#"}
      onClick={handleClick}
      style={{
        ...style,
        opacity: url ? 1 : 0.45,
        pointerEvents: url ? undefined : "none",
      }}
    >
      {children}
    </a>
  );
}
