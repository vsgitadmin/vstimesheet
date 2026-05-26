

const BANNER_PATH = '/public/wallpaper.jpeg';

function escapeAttr(s) {
  if (!s) return '';
  return String(s).replace(/&/g, '&amp;').replace(/'/g, '&#39;');
}

function getEmailBannerAbsoluteUrl() {
  const explicit = process.env.EMAIL_BANNER_URL;
  if (explicit && String(explicit).trim()) {
    return String(explicit).trim().replace(/\/+$/, '');
  }

  let base = (process.env.FILE_SERVER || process.env.BACKEND_URL || '').trim();
  if (!base) {
    const port = process.env.PORT || process.env.port || 50000;
    base = `http://localhost:${port}`;
  }

  base = base.replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(base)) {
    base = `http://${base.replace(/^\/+/, '')}`;
  }

  return `${base}${BANNER_PATH}`;
}

async function withEmailBanner(props = {}) {
  const raw = getEmailBannerAbsoluteUrl();
  return { ...props, bannerUrl: escapeAttr(raw) };
}

module.exports = { withEmailBanner, getEmailBannerAbsoluteUrl, BANNER_PATH };
