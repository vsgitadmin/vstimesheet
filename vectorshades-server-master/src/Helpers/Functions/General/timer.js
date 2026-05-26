function computeInProgressHours(logs) {
    const normalize = s => String(s || '').toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim()
    const fromToRegex = /(?:Status\s+Changed\s+)?from\s+(.+?)\s+to\s+(.+?)(?:\s*[-–—].*)?$/i
    function parseFromTo(text) {
        if (!text) return null
        const m = fromToRegex.exec(text)
        if (m) return { from: m[1].trim(), to: m[2].trim() }
        const f = /from\s+(.+?)\s+to\s+(.+?)(?:\s|$)/i.exec(text)
        return f ? { from: f[1].trim(), to: f[2].trim() } : null
    }
    const sorted = [...logs].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    let ongoingStart = null, totalSeconds = 0
    for (const log of sorted) {
        const p = parseFromTo(log.text)
        if (p) {
            const fromN = normalize(p.from), toN = normalize(p.to)
            if (toN === 'inprogress' || toN === 'in progress') {
                if (!ongoingStart) ongoingStart = new Date(log.createdAt)
            }
            if (fromN === 'inprogress' || fromN === 'in progress') {
                if (ongoingStart) {
                    const diff = (new Date(log.createdAt) - ongoingStart) / 1000
                    if (diff > 0) totalSeconds += diff
                    ongoingStart = null
                }
            }
        } else {
            const text = String(log.text || '').toLowerCase()
            if (/\bto\s*in\s*progress\b/.test(text)) {
                if (!ongoingStart) ongoingStart = new Date(log.createdAt)
            } else if (/\bfrom\s*in\s*progress\b/.test(text)) {
                if (ongoingStart) {
                    const diff = (new Date(log.createdAt) - ongoingStart) / 1000
                    if (diff > 0) totalSeconds += diff
                    ongoingStart = null
                }
            } else if (/\bto\s*(paused|completed|done|closed|resolved)\b/.test(text) && /\bin\s*progress\b/.test(text)) {
                if (ongoingStart) {
                    const diff = (new Date(log.createdAt) - ongoingStart) / 1000
                    if (diff > 0) totalSeconds += diff
                    ongoingStart = null
                }
            }
        }
    }
    return Math.round((totalSeconds / 3600) * 100) / 100
}

function finalTwoActivities(activities, completedHours) {
  const toISTISO = (d) => {
    const base = new Date(d)
    const ist = new Date(base.getTime() + 330 * 60000)
    const pad = (n, l = 2) => String(n).padStart(l, '0')
    const y = ist.getUTCFullYear()
    const m = pad(ist.getUTCMonth() + 1)
    const day = pad(ist.getUTCDate())
    const hh = pad(ist.getUTCHours())
    const mm = pad(ist.getUTCMinutes())
    const ss = pad(ist.getUTCSeconds())
    const ms = pad(ist.getUTCMilliseconds(), 3)
    return `${y}-${m}-${day}T${hh}:${mm}:${ss}.${ms}+05:30`
  }

  const targetMs = Math.max(0, Number(completedHours) || 0) * 3600_000
  const arr = activities.map(a => (a?.toObject ? a.toObject() : a))
  const asc = [...arr].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  const isStart = ev => /\bto\s*in\s*progress\b/i.test(String(ev.text || ''))
  const isEnd = ev => /\bfrom\s*in\s*progress\b/i.test(String(ev.text || '')) || /\bto\s*(paused|completed|done|closed|resolved)\b/i.test(String(ev.text || ''))

  const segments = []
  let start = null
  for (const ev of asc) {
    if (isStart(ev)) {
      if (!start) start = ev
    } else if (isEnd(ev) && start) {
      segments.push({ start, end: ev })
      start = null
    }
  }

  if (!segments.length) return []

  let cum = 0
  for (const { start: sEv, end: eEv } of segments) {
    const s = new Date(sEv.createdAt).getTime()
    const e = new Date(eEv.createdAt).getTime()
    const seg = Math.max(0, e - s)
    if (cum + seg >= targetMs) {
      const rem = targetMs - cum
      const endTime = rem <= 0 ? e : s + rem
      const outStart = { ...sEv, createdAt: toISTISO(sEv.createdAt) }
      const outEnd = { ...eEv, createdAt: toISTISO(endTime) }
      return [outStart, outEnd]
    }
    cum += seg
  }

  const firstStart = segments[0].start
  const endTime = new Date(firstStart.createdAt).getTime() + targetMs
  return [
    { ...firstStart, createdAt: toISTISO(firstStart.createdAt) },
    { ...segments[segments.length - 1].end, createdAt: toISTISO(endTime) }
  ]
}

module.exports = {
    computeInProgressHours,
    finalTwoActivities
}
