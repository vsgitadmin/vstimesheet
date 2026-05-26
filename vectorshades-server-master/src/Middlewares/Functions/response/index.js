function hasDecimalPlaces(n) {
  if (!Number.isFinite(n)) return false;
  return !Number.isInteger(n);
}

function roundToTwoDecimals(n) {
  // Keep integers as-is; if decimal, round to max 2 places.
  return Number.isInteger(n) ? n : Number(n.toFixed(2));
}

function sanitizeDecimalsDeep(value, seen) {
  if (typeof value === "number") {
    return hasDecimalPlaces(value) ? roundToTwoDecimals(value) : value;
  }

  if (value === null || value === undefined) return value;

  if (Array.isArray(value)) {
    if (seen.has(value)) return value;
    seen.add(value);
    return value.map((v) => sanitizeDecimalsDeep(v, seen));
  }

  if (typeof value === "object") {
    if (Buffer.isBuffer(value)) return value;
    if (value instanceof Date) return value;
    if (value instanceof RegExp) return value;

    if (seen.has(value)) return value;
    seen.add(value);

    // If the object customizes JSON output, sanitize that JSON shape.
    if (typeof value.toJSON === "function") {
      return sanitizeDecimalsDeep(value.toJSON(), seen);
    }

    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = sanitizeDecimalsDeep(v, seen);
    }
    return out;
  }

  return value;
}

function truncateResponseDecimalsMiddleware(req, res, next) {
  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);

  res.json = (body) => originalJson(sanitizeDecimalsDeep(body, new WeakSet()));

  res.send = (body) => {
    if (typeof body === "number") {
      return originalSend(
        hasDecimalPlaces(body) ? roundToTwoDecimals(body) : body
      );
    }

    if (body && (Array.isArray(body) || typeof body === "object") && !Buffer.isBuffer(body)) {
      return originalSend(sanitizeDecimalsDeep(body, new WeakSet()));
    }

    return originalSend(body);
  };

  next();
}

module.exports = {
  truncateResponseDecimalsMiddleware,
};

