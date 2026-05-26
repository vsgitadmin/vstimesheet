module.exports = ({ name = "", type = "", message = "", bannerUrl = "" } = {}) => {
  const safeName = name || "Team";
  const safeType = type || "Activity";
  const safeMessage = message || "";

  const iconConfetti = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle"><path d="M4 4L7 7" stroke="#f59e0b" stroke-width="1.6" stroke-linecap="round"/><path d="M9 2L10 5" stroke="#ef4444" stroke-width="1.6" stroke-linecap="round"/><path d="M20 4L17 7" stroke="#10b981" stroke-width="1.6" stroke-linecap="round"/><path d="M14 20L13 17" stroke="#3b82f6" stroke-width="1.6" stroke-linecap="round"/></svg>`;
  const iconCalendar = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle"><path d="M7 11H9V13H7V11Z" fill="#6b7280"/><path d="M11 11H13V13H11V11Z" fill="#6b7280"/><path d="M15 11H17V13H15V11Z" fill="#6b7280"/><path d="M19 4H5C3.9 4 3 4.9 3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4Z" fill="#6b7280"/></svg>`;
  const iconMegaphone = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle"><path d="M3 10V14H6L14 20V4L6 10H3Z" fill="#6b7280"/><path d="M16 8C17.66 8 19 9.34 19 11C19 12.66 17.66 14 16 14" stroke="#6b7280" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  return `<div style="background-color:#f1f1f1;padding:20px 10px">
    <div style="width:800px;margin:0 auto;border-radius:5px;overflow:hidden;">
      <div style="background-image:url('${bannerUrl}');width:100%;height:200px;background-size:cover;background-position:center;"></div>

      <div style="background-color:#fff;padding:20px;margin:0 0 30px 0;">
        <div style="margin-top:10px;">
          <h2 style="font-weight:600;font-size:20px;margin:0;font-family:'Work Sans',sans-serif;">Dear ${safeName},</h2>

          <div style="margin-top:12px;">
            <p style="font-family:'Work Sans',sans-serif;line-height:1.5;color:#374151;white-space:pre-wrap;">
              ${safeMessage}
            </p>

            <p style="font-family:'Work Sans',sans-serif;font-weight:600;margin:12px 0 0;display:flex;align-items:center;gap:8px;color:#111;">
              <span style="display:inline-flex;align-items:center;gap:6px;">${iconMegaphone}<span>Activity Type :</span></span>
              <span style="background:#eef2ff;padding:6px 10px;border-radius:18px;font-weight:600;color:#1f6feb;margin-left:8px;">${safeType}</span>
            </p>

            <div style="margin-top:14px;font-family:'Work Sans',sans-serif;color:#374151;">
              <p style="margin:6px 0;display:flex;align-items:center;gap:8px;">
                <span style="display:inline-flex;align-items:center;">${iconCalendar}</span>
              </p>

              <p style="margin:6px 0;display:flex;align-items:center;gap:8px;">
                <span style="display:inline-flex;align-items:center;">${iconConfetti}</span>
                <span style="font-size:13px;color:#6b7280;">What to expect: light refreshments, quick ice-breakers and a chance to connect across teams.</span>
              </p>
            </div>

            <div style="margin-top:16px;padding:12px;background:#fafafa;border:1px solid #f0f0f0;border-radius:6px;">
              <p style="margin:0;font-family:'Work Sans',sans-serif;font-weight:600;color:#111;">Highlights</p>
              <ul style="margin:8px 0 0 18px;padding:0;color:#374151;font-family:'Work Sans',sans-serif;">
                <li style="margin:6px 0;">Opportunity to meet colleagues from other teams</li>
                <li style="margin:6px 0;">Short fun activities and photo moment</li>
                <li style="margin:6px 0;">Surprise shoutouts and treats</li>
              </ul>
            </div>

            <div style="padding: 0;margin: 16px 0 0 0;">
              <p style="padding:0;margin:0;font-family:'Work Sans',sans-serif;color: lightgrey;">Vector Shades LTD</p>
              <p style="padding:0;margin:6px 0 0 0;font-family:'Work Sans',sans-serif;color: lightgrey;">Kochi, Kerala, India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;}
