import { useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/router'
import { PauseCircleFilled, PlayCircleFilled, Close, PictureInPictureAlt } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { ParentStore } from '../../../pages/_app'
import { editSingleTasksController } from '../../Controllers/projects/index'
import { broadcastTaskStatusUpdate } from '../../Utils/taskStatusEvents'
import styles from '../../../styles/ActiveWorkingWidget.module.css'

const supportsDocumentPiP = () => typeof window !== 'undefined' && 'documentPictureInPicture' in window

// a Document Picture-in-Picture window starts with a blank document, so its
// styling has to be copied over by hand from the main page every time one
// is opened
const copyStylesInto = (pipDocument) => {
  [...document.styleSheets].forEach((sheet) => {
    try {
      const rules = [...sheet.cssRules].map((rule) => rule.cssText).join('')
      const style = pipDocument.createElement('style')
      style.textContent = rules
      pipDocument.head.appendChild(style)
    } catch {
      // cross-origin sheets can't have their rules read - fall back to
      // re-linking them instead
      if (sheet.href) {
        const link = pipDocument.createElement('link')
        link.rel = 'stylesheet'
        link.type = sheet.type
        link.media = sheet.media?.mediaText || ''
        link.href = sheet.href
        pipDocument.head.appendChild(link)
      }
    }
  })
}

// Persistent "currently working" widget for the task the signed-in user has
// started. By default it's a floating pill inside the page (portaled to
// document.body so it sits above in-page modals). The pop-out button takes
// it a step further with the Document Picture-in-Picture API: a real,
// separate always-on-top OS window that floats above every app and browser
// window, not just this tab - Chrome/Edge only, and it has to be opened from
// a direct user click (the browser refuses to open one otherwise).
const ActiveWorkingWidget = () => {
  const { ParentState, setParentState } = useContext(ParentStore)
  const task = ParentState?.activeWorkingTask
  const router = useRouter()
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [pipWindow, setPipWindow] = useState(null)
  const [idle, setIdle] = useState(false)
  const pipSupported = useRef(false)
  const idleTimeoutRef = useRef(null)

  useEffect(() => {
    setMounted(true)
    pipSupported.current = supportsDocumentPiP()
  }, [])

  // dim the widget after a few seconds of no interaction; hovering it (CSS
  // :hover) always brings it back to full opacity regardless of this
  const clearIdleTimer = () => clearTimeout(idleTimeoutRef.current)
  const scheduleIdle = () => {
    clearIdleTimer()
    idleTimeoutRef.current = setTimeout(() => setIdle(true), 5000)
  }

  useEffect(() => {
    scheduleIdle()
    return clearIdleTimer
  }, [task?.id])

  const handleMouseEnter = () => { clearIdleTimer(); setIdle(false) }
  const handleMouseLeave = () => scheduleIdle()

  useEffect(() => {
    if (!task || task.status !== 'In Progress') return
    const tick = () => setElapsedSeconds(Math.max(0, Math.floor((Date.now() - new Date(task.startedOn).getTime()) / 1000)))
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [task?.status, task?.startedOn])

  // if the task tracking ends (completed/dismissed) while floated out,
  // close the popped-out window along with it
  useEffect(() => {
    if (!task && pipWindow && !pipWindow.closed) pipWindow.close()
  }, [task, pipWindow])

  if (!mounted || !task) return null

  const formatElapsed = (totalSeconds) => {
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
    const s = String(totalSeconds % 60).padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  const updateActiveTask = (body) => {
    editSingleTasksController({ id: task.id, ...body }, { project: task.projectId })
      .then(() => {
        setParentState((prev) => ({ ...prev, activeWorkingTask: { ...prev.activeWorkingTask, ...body } }))
        broadcastTaskStatusUpdate({ id: task.id, ...body })
      })
      .catch(() => toast.error('unable to update task'))
  }

  const pause = (e) => { e?.stopPropagation(); updateActiveTask({ status: 'Paused' }) }
  const resume = (e) => { e?.stopPropagation(); updateActiveTask({ status: 'In Progress', startedOn: new Date() }) }

  const dismiss = (e) => {
    e?.stopPropagation()
    if (pipWindow && !pipWindow.closed) pipWindow.close()
    setParentState((prev) => {
      const { activeWorkingTask, ...rest } = prev
      return rest
    })
  }

  const openTask = () => {
    router.push({
      pathname: `/admin/dashboard/projects/${task.projectId}`,
      query: { taskpopup: task.id, group: task.section },
    })
  }

  // opens the widget in a real OS-level window that floats above every
  // app/window, not just this tab - must run directly off the user's click
  const popOut = async (e) => {
    e?.stopPropagation()
    if (!pipSupported.current) {
      toast.info('Floating above other apps needs Chrome or Edge')
      return
    }
    try {
      const pip = await window.documentPictureInPicture.requestWindow({ width: 220, height: 100 })
      copyStylesInto(pip.document)
      pip.document.body.style.margin = '0'
      pip.addEventListener('pagehide', () => setPipWindow(null), { once: true })
      setPipWindow(pip)
    } catch (err) {
      console.log(err)
      toast.error('unable to open floating widget')
    }
  }

  const widgetBody = (
    <div
      className={styles.widget}
      data-pip={pipWindow ? 'true' : 'false'}
      data-idle={idle ? 'true' : 'false'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.widget_project} onClick={openTask}>
        <span className={styles.widget_dot} data-status={task.status} />
        {task.projectName || 'Project'}
      </div>
      <div className={styles.widget_name} onClick={openTask}>{task.taskName}</div>
      <div className={styles.widget_controls}>
        <span className={styles.widget_time}>{task.status === 'Paused' ? 'Paused' : formatElapsed(elapsedSeconds)}</span>
        <div className={styles.widget_actions}>
          {task.status === 'In Progress' && (
            <button title="Pause" onClick={pause}><PauseCircleFilled /></button>
          )}
          {task.status === 'Paused' && (
            <button title="Resume" onClick={resume}><PlayCircleFilled /></button>
          )}
          {!pipWindow && pipSupported.current && (
            <button title="Float above all apps" onClick={popOut}><PictureInPictureAlt /></button>
          )}
          <button className={styles.widget_close} title="Dismiss" onClick={dismiss}><Close fontSize="small" /></button>
        </div>
      </div>
    </div>
  )

  return createPortal(widgetBody, pipWindow ? pipWindow.document.body : document.body)
}

export default ActiveWorkingWidget
