
const getDate = (date = new Date()) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();

  return `${day}-${month}-${year}`;
};

function nowInIST() {
  // produce an ISO‐compatible string in IST…
  const istString = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' });
  // feed it back into Date() so mongoose will store it as a real Date object
  return new Date(istString);
}


function getDatesArray(startISO, endISO) {
  const dates = [];
  let current = new Date(startISO);
  const end = new Date(endISO);

  while (current <= end) {
    const dd = String(current.getDate()).padStart(2, '0');
    const mm = String(current.getMonth() + 1).padStart(2, '0');
    const yyyy = current.getFullYear();
    dates.push(`${dd}-${mm}-${yyyy}`);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

const formatHours = (hours) => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
};

function toIsoDate(d) {
  const [day, month, year] = d.split('-');
  return `${year}-${month}-${day}`;
}

module.exports = { getDate, formatHours, nowInIST, getDatesArray , toIsoDate }