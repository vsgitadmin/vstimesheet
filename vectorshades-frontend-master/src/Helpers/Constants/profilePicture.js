/** Canonical S3 key for an employee profile photo. */
export function employeeProfilePictureKey(employeeId) {
  if (employeeId == null || employeeId === '') return '';
  const id = String(employeeId).trim().replace(/^\/+/, '');
  return id ? `profile/${id}.jpeg` : '';
}

/** Normalize a stored key or legacy URL to a clean S3 object key. */
export function normalizeProfilePictureKey(keyOrUrl, employeeId) {
  if (keyOrUrl == null || String(keyOrUrl).trim() === '') {
    return employeeProfilePictureKey(employeeId);
  }
  const trimmed = String(keyOrUrl).trim();
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const path = decodeURIComponent(new URL(trimmed.split('?')[0]).pathname || '')
        .replace(/^\/+/, '');
      if (path) return path.replace(/\/{2,}/g, '/');
    } catch {
      return employeeProfilePictureKey(employeeId);
    }
  }
  return trimmed.replace(/^\/+/, '').replace(/\/{2,}/g, '/');
}

/** Keys to try when loading a profile image (stored key, standard path, legacy activation path). */
export function profilePictureKeysToTry(employeeId, storedKey) {
  const keys = [];
  const add = (k) => {
    const n = k ? String(k).replace(/^\/+/, '').replace(/\/{2,}/g, '/') : '';
    if (n && !keys.includes(n)) keys.push(n);
  };
  add(storedKey);
  add(employeeProfilePictureKey(employeeId));
  if (employeeId) add(`profile//${employeeId}.jpeg`);
  return keys;
}
