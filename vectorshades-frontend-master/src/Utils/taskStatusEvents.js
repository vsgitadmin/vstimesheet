// Lightweight same-tab pub/sub for task status changes. A task's status can
// be changed from several places that each keep their own local copy of it
// (the task list on the project detail page, the task detail popup, the
// floating "currently working" widget) - broadcasting a plain window event
// whenever one of them writes a change lets the others patch their own copy
// in place instead of needing a shared store or a refetch.
export const TASK_STATUS_UPDATED_EVENT = 'task-status-updated'

// detail should be { id, ...fieldsThatChanged } e.g. { id, status: 'Paused' }
export const broadcastTaskStatusUpdate = (detail) => {
  if (typeof window === 'undefined' || !detail?.id) return
  window.dispatchEvent(new CustomEvent(TASK_STATUS_UPDATED_EVENT, { detail }))
}

// fires handler(detail) whenever a matching task's status changes;
// `handler` receives the raw event detail ({ id, ...changes })
export const onTaskStatusUpdate = (handler) => {
  if (typeof window === 'undefined') return () => {}
  const listener = (e) => handler(e.detail)
  window.addEventListener(TASK_STATUS_UPDATED_EVENT, listener)
  return () => window.removeEventListener(TASK_STATUS_UPDATED_EVENT, listener)
}
