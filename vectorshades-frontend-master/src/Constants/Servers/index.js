export const BACKEND_URL =
  process.env.NEXT_PUBLIC_AXIOS_BASEURL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  "https://tsm.vectorshades.com/server/";

/**
 * Origin-only URL for Socket.IO. If BACKEND_URL includes a REST path (e.g.
 * https://host/server), socket.io-client would treat that path as a namespace,
 * while this server only listens on the default namespace "/".
 * Optional override: NEXT_PUBLIC_SOCKET_ORIGIN (e.g. https://tsm.vectorshades.com)
 */
export function getSocketIoServerUrl() {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SOCKET_ORIGIN) {
    return String(process.env.NEXT_PUBLIC_SOCKET_ORIGIN).replace(/\/$/, "");
  }
  const raw = String(BACKEND_URL || "").trim();
  if (!raw) return "http://localhost:50000";
  try {
    const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    return new URL(withProto).origin;
  } catch {
    return raw.replace(/\/$/, "");
  }
}
