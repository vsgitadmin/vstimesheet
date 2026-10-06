import { useEffect, useRef, useState } from 'react'

// Single, app-wide "grid vs list/table" display preference. Every page that
// has its own grid/table (or card/table) toggle used to keep that choice as
// page-local state, resetting back to a default every time you navigated
// away and back. This persists it to localStorage under one shared key, so
// picking grid view on one page keeps every other page in grid view too,
// until it's explicitly changed again (here or elsewhere).
const STORAGE_KEY = 'preferredViewMode'
const DEFAULT_VIEW_MODE = 'grid' // 'grid' | 'list'

const readStoredViewMode = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === 'grid' || stored === 'list' ? stored : DEFAULT_VIEW_MODE
  } catch {
    return DEFAULT_VIEW_MODE
  }
}

// pass a default only if this particular page should start differently
// before the user has ever chosen a mode anywhere (rare - most callers
// should just call useViewMode())
export const useViewMode = (defaultMode = DEFAULT_VIEW_MODE) => {
  const [viewMode, setViewModeState] = useState(defaultMode)
  const hydrated = useRef(false)

  useEffect(() => {
    setViewModeState(readStoredViewMode())
    hydrated.current = true

    // keep in sync if another tab (or another mounted instance) changes it
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY && (e.newValue === 'grid' || e.newValue === 'list')) {
        setViewModeState(e.newValue)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const setViewMode = (mode) => {
    setViewModeState(mode)
    try { window.localStorage.setItem(STORAGE_KEY, mode) } catch {}
  }

  return [viewMode, setViewMode]
}

export default useViewMode
