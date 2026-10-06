import { useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { LinearProgress, Pagination } from '@mui/material'
import { ParentStore } from '../../../pages/_app'
import { requestUpdatePasswordController, updatePasswordController } from '../../Controllers/Employee/index'
import {
  createBackupController,
  listBackupsController,
  restoreBackupController,
  getBackupProgressController,
  downloadBackupController,
  uploadBackupController,
  deleteBackupController,
} from '../../Controllers/Backup/index'
import ProfileImage from '../ProfileImage/Image'
import Otp from '../Auth/Otp'
import styles from '../../../styles/Settings.module.css'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined'
import BackupOutlinedIcon from '@mui/icons-material/BackupOutlined'
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import { useViewMode } from '../../Hooks/useViewMode'

const NAV_ITEMS = [
  { key: 'details', label: 'My Details', icon: <PersonOutlineIcon /> },
  { key: 'password', label: 'Password', icon: <LockOutlinedIcon /> },
]

const formatBytes = (bytes) => {
  if (!bytes && bytes !== 0) return '-'
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let value = bytes
  let unitIndex = -1
  do {
    value /= 1024
    unitIndex++
  } while (value >= 1024 && unitIndex < units.length - 1)
  return `${value.toFixed(1)} ${units[unitIndex]}`
}

const formatDate = (iso) => {
  if (!iso) return '-'
  try {
    return new Date(iso).toLocaleString()
  } catch (e) {
    return iso
  }
}

const ROLE_LABELS = {
  SA: 'Super Admin',
  HR: 'Human Resources',
  EMP: 'Employee',
  PA: 'Project Admin',
  RB: 'Steel Rebar Employee',
  STL: 'Steel Employee',
}

const AppSettings = () => {
  const { ParentState } = useContext(ParentStore)
  const auth = ParentState?.auth
  const router = useRouter()

  const isSuperAdmin = auth?.role === 'SA'
  const navItems = isSuperAdmin
    ? [...NAV_ITEMS, { key: 'backup', label: 'Backup & Restore', icon: <BackupOutlinedIcon /> }]
    : NAV_ITEMS

  const [activeTab, setActiveTab] = useState('details')

  // password tab state
  const [codeRequested, setCodeRequested] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [sending, setSending] = useState(false)

  // backup & restore tab state
  const [backups, setBackups] = useState([])
  const [backupsLoading, setBackupsLoading] = useState(false)
  const [backupPage, setBackupPage] = useState(1)
  const [backupTotalPages, setBackupTotalPages] = useState(1)
  const [backupTotal, setBackupTotal] = useState(0)
  const [backupViewMode, setBackupViewMode] = useViewMode()
  const [backupJob, setBackupJob] = useState(null) // { phase, percent, currentCollection, docsDone, docsTotal }
  const [restoreTargetId, setRestoreTargetId] = useState(null)
  const [restoreJob, setRestoreJob] = useState(null) // { id, phase, percent, currentCollection, docsDone, docsTotal }
  const [downloadingId, setDownloadingId] = useState(null)
  const [deleteTargetId, setDeleteTargetId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [uploadPercent, setUploadPercent] = useState(null) // null = not uploading, 0-100 while in flight
  const fileInputRef = useRef(null)
  const pollCancelRef = useRef(0)

  const fetchBackups = (page = backupPage) => {
    if (!isSuperAdmin) return
    setBackupsLoading(true)
    return listBackupsController(page, 15)
      .then((res) => {
        const result = res?.data?.response || {}
        const data = result.data || []
        // A delete can empty out what was the last page - fall back a page
        // instead of showing a suddenly-blank list. Returning the recursive
        // call keeps it chained under this same promise, so the .finally
        // below only clears loading once that retry actually finishes too.
        if (data.length === 0 && page > 1) return fetchBackups(page - 1)

        setBackups(data)
        setBackupPage(result.page || page)
        setBackupTotalPages(result.totalPages || 1)
        setBackupTotal(result.total ?? data.length)
      })
      .catch((err) => toast.error(err?.response?.data?.message || 'Unable to fetch backups'))
      .finally(() => setBackupsLoading(false))
  }

  const handleBackupPageChange = (event, value) => {
    fetchBackups(value)
  }

  useEffect(() => {
    if (activeTab === 'backup') fetchBackups(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  // Stop polling if the component unmounts / tab changes mid-job.
  useEffect(() => () => { pollCancelRef.current++ }, [])

  const POLL_INTERVAL_MS = 700

  // Job progress lives in server memory, so it can be lost mid-poll (a
  // deploy, a crash, a manual restart) even though the work itself keeps
  // running/finished fine on disk. Treat a 404 here as "lost track of it",
  // not "it failed" - callers decide how to recover from that.
  const pollJobProgress = (jobId, onUpdate) => {
    const token = pollCancelRef.current
    return new Promise((resolve, reject) => {
      const tick = () => {
        if (pollCancelRef.current !== token) return
        getBackupProgressController(jobId)
          .then((res) => {
            const job = res?.data?.response?.data
            if (!job) return resolve({ phase: 'lost' })
            onUpdate(job)
            if (job.phase === 'completed' || job.phase === 'failed') resolve(job)
            else setTimeout(tick, POLL_INTERVAL_MS)
          })
          .catch((err) => {
            if (err?.response?.status === 404) return resolve({ phase: 'lost' })
            reject(err)
          })
      }
      tick()
    })
  }

  const handleCreateBackup = () => {
    setBackupJob({ phase: 'starting', percent: 0 })
    const startedAt = Date.now()
    createBackupController()
      .then((res) => {
        const jobId = res?.data?.response?.data?.jobId
        if (!jobId) throw new Error(res?.data?.message || 'Unable to start backup')
        return pollJobProgress(jobId, setBackupJob)
      })
      .then((job) => {
        if (job.phase === 'failed') {
          toast.error(job.error || 'Backup failed')
          return
        }
        if (job.phase === 'lost') {
          // The server restarted mid-backup and forgot the job, but the backup
          // itself may well have finished and been written to disk - check.
          return listBackupsController(1, 15).then((res) => {
            const latest = res?.data?.response?.data?.[0]
            if (latest && new Date(latest.createdAt).getTime() >= startedAt) {
              toast.success('Backup completed successfully (progress tracking was interrupted by a server restart)')
            } else {
              toast.error('Lost track of the backup job - the server may have restarted. Please try again.')
            }
            return fetchBackups(1)
          })
        }
        toast.success('Backup created successfully')
        fetchBackups(1)
      })
      .catch((err) => toast.error(err?.response?.data?.message || err.message || 'Unable to create backup'))
      .finally(() => setBackupJob(null))
  }

  const handleRestoreBackup = (id) => {
    setRestoreJob({ id, phase: 'starting', percent: 0 })
    restoreBackupController(id)
      .then((res) => {
        const jobId = res?.data?.response?.data?.jobId
        if (!jobId) throw new Error(res?.data?.message || 'Unable to start restore')
        return pollJobProgress(jobId, (job) => setRestoreJob({ id, ...job }))
      })
      .then((job) => {
        if (job.phase === 'lost') {
          toast.error('Lost track of the restore job - the server may have restarted while restoring. Please verify your data before continuing.')
          return
        }
        if (job.phase === 'failed') {
          toast.error(job.error || 'Restore failed')
        } else if (job.error) {
          toast.error(job.error)
        } else {
          toast.success('Backup restored successfully. Please refresh the page.')
        }
      })
      .catch((err) => toast.error(err?.response?.data?.message || err.message || 'Restore failed'))
      .finally(() => {
        setRestoreJob(null)
        setRestoreTargetId(null)
      })
  }

  const handleDownloadBackup = (id) => {
    setDownloadingId(id)
    downloadBackupController(id)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${id}.ndjson.gz`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      })
      .catch((err) => toast.error(err?.response?.data?.message || 'Unable to download backup'))
      .finally(() => setDownloadingId(null))
  }

  const handleBrowseClick = () => {
    if (uploadPercent !== null) return
    fileInputRef.current?.click()
  }

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // let the same file be picked again later (e.g. after a failed upload)
    if (!file) return

    setUploadPercent(0)
    uploadBackupController(file, (progressEvent) => {
      if (!progressEvent.total) return
      setUploadPercent(Math.round((progressEvent.loaded / progressEvent.total) * 100))
    })
      .then((res) => {
        const uploadedId = res?.data?.response?.data?.id
        toast.success('Backup uploaded - confirm below to restore it')
        fetchBackups(1)
        // Uploading is just step one - the point is to restore from it, so
        // go straight into the same confirm-and-restore flow used for any
        // other backup in the list, rather than leaving the user to find
        // the newly-added entry and click Restore on it themselves.
        if (uploadedId) setRestoreTargetId(uploadedId)
      })
      .catch((err) => toast.error(err?.response?.data?.message || err.message || 'Unable to upload backup'))
      .finally(() => setUploadPercent(null))
  }

  const handleDeleteBackup = (id) => {
    setDeletingId(id)
    deleteBackupController(id)
      .then((res) => {
        if (res.status === 200) {
          toast.success('Backup deleted')
          fetchBackups(backupPage) // stays on the current page; falls back a page itself if that emptied it out
        } else {
          toast.error(res?.data?.message || 'Unable to delete backup')
        }
      })
      .catch((err) => toast.error(err?.response?.data?.message || 'Unable to delete backup'))
      .finally(() => {
        setDeletingId(null)
        setDeleteTargetId(null)
      })
  }

  const jobStatusLabel = (job) => {
    if (!job) return ''
    const labels = {
      starting: 'Starting...',
      counting: 'Counting documents...',
      exporting: `Exporting${job.currentCollection ? ` "${job.currentCollection}"` : ''}...`,
      finalizing: 'Finalizing...',
      restoring: `Restoring${job.currentCollection ? ` "${job.currentCollection}"` : ''}...`,
      completed: 'Completed',
      failed: 'Failed',
    }
    return labels[job.phase] || job.phase
  }

  const requestCode = () => {
    if (!auth?.email) return
    setSending(true)
    requestUpdatePasswordController({ email: auth.email })
      .then((res) => {
        if (res.status === 200) {
          toast.success('Code sent to your email')
          setCodeRequested(true)
        } else {
          toast.error('Unable to send code')
        }
      })
      .catch((err) => toast.error(err.message || 'Unable to send code'))
      .finally(() => setSending(false))
  }

  const submitNewPassword = () => {
    if (password.length < 6) return toast.error('Password must be at least 6 characters')
    if (password !== confirmPassword) return toast.error('Passwords must match')
    if (otp.length < 4) return toast.error('Enter the 4 digit code sent to your email')

    setSending(true)
    updatePasswordController({ email: auth.email, password, code: otp })
      .then((res) => {
        if (res.status === 200) {
          toast.success('Password updated')
          setCodeRequested(false)
          setPassword('')
          setConfirmPassword('')
          setOtp('')
        } else {
          toast.error('Unable to update password')
        }
      })
      .catch((err) => toast.error(err.message || 'Unable to update password'))
      .finally(() => setSending(false))
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div className={styles.titleBlock}>
          <h1><span className={styles.titleIcon}><SettingsOutlinedIcon /></span>Settings</h1>
          <p className={styles.subtitle}>Manage your account details and security</p>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.nav}>
          {navItems.map((item) => (
            <button
              type="button"
              key={item.key}
              className={`${styles.navItem} ${activeTab === item.key ? styles.navItemActive : ''}`}
              onClick={() => setActiveTab(item.key)}
            >
              {item.icon}{item.label}
            </button>
          ))}
        </div>

        <div className={styles.content}>
          {activeTab === 'details' && (
            <>
              <div className={styles.contentHeading}>My Details</div>
              <div className={styles.contentSubtitle}>Your account information as recorded in the system</div>

              <div className={styles.profileRow}>
                <ProfileImage id={auth?._id} size={64} />
                <div>
                  <h3>{auth?.firstName} {auth?.lastName}</h3>
                  <span className={styles.rolePill}>{ROLE_LABELS[auth?.role] || auth?.role}</span>
                </div>
              </div>

              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <h4>Email</h4>
                  <h5>{auth?.email || '-'}</h5>
                </div>
                <div className={styles.detailItem}>
                  <h4>Designation</h4>
                  <h5>{auth?.designation || '-'}</h5>
                </div>
                <div className={styles.detailItem}>
                  <h4>Department</h4>
                  <h5>{auth?.department || '-'}</h5>
                </div>
                <div className={styles.detailItem}>
                  <h4>Employee ID</h4>
                  <h5>{auth?.uid || auth?._id || '-'}</h5>
                </div>
              </div>

              {auth?._id && (
                <a className={styles.editBtn} onClick={() => router.push(`/admin/dashboard/employee/profile/edit/${auth._id}`)}>
                  <EditOutlinedIcon />Edit Profile
                </a>
              )}
            </>
          )}

          {activeTab === 'password' && (
            <>
              <div className={styles.contentHeading}>Password</div>
              <div className={styles.contentSubtitle}>
                {!codeRequested
                  ? "We'll email a 4-digit code to verify it's you before changing your password."
                  : `Enter the code sent to ${auth?.email} along with your new password.`}
              </div>

              {!codeRequested ? (
                <button type="button" className={styles.submitBtn} onClick={requestCode} disabled={sending}>
                  <SendOutlinedIcon />{sending ? 'Sending...' : 'Send Verification Code'}
                </button>
              ) : (
                <div className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label>New Password</label>
                    <input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Confirm Password</label>
                    <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
                  </div>
                  <Otp onChange={setOtp} />
                  <button type="button" className={styles.submitBtn} onClick={submitNewPassword} disabled={sending}>
                    <VpnKeyOutlinedIcon />{sending ? 'Updating...' : 'Update Password'}
                  </button>
                  <span className={styles.helperText} onClick={() => setCodeRequested(false)} style={{ cursor: 'pointer' }}>Didn't get a code? Send again</span>
                </div>
              )}
            </>
          )}

          {activeTab === 'backup' && isSuperAdmin && (
            <>
              <div className={styles.contentHeading}>Backup & Restore</div>
              <div className={styles.contentSubtitle}>Take a full snapshot of the database, or restore the system from a previous backup</div>

              <div className={styles.actionRow}>
                <button type="button" className={styles.submitBtn} onClick={handleCreateBackup} disabled={!!backupJob}>
                  <BackupOutlinedIcon />{backupJob ? 'Creating Backup...' : 'Create Backup'}
                </button>
                <button type="button" className={styles.browseBtn} onClick={handleBrowseClick} disabled={uploadPercent !== null}>
                  <UploadFileOutlinedIcon />{uploadPercent !== null ? `Uploading... ${uploadPercent}%` : 'Browse & Restore'}
                </button>
                <input ref={fileInputRef} type="file" accept=".gz" onChange={handleFileSelected} style={{ display: 'none' }} />
              </div>
              <p className={styles.helperText}>Pick a previously downloaded backup file (.ndjson.gz) to restore your data from it directly - handy for restoring a backup from another environment.</p>

              {backupJob && (
                <div className={styles.progressBlock}>
                  <div className={styles.progressLabel}>
                    <span>{jobStatusLabel(backupJob)}</span>
                    <span>{backupJob.percent ?? 0}%</span>
                  </div>
                  <LinearProgress variant="determinate" value={backupJob.percent ?? 0} className={styles.progressBar} />
                  {backupJob.docsTotal > 0 && (
                    <div className={styles.progressSubtext}>{backupJob.docsDone ?? 0} / {backupJob.docsTotal} documents</div>
                  )}
                </div>
              )}

              {uploadPercent !== null && (
                <div className={styles.progressBlock}>
                  <div className={styles.progressLabel}>
                    <span>Uploading backup file...</span>
                    <span>{uploadPercent}%</span>
                  </div>
                  <LinearProgress variant="determinate" value={uploadPercent} className={styles.progressBar} />
                </div>
              )}

              <div className={styles.backupListHeadingRow}>
                <div className={styles.backupListHeading}>{backupTotal} Backup{backupTotal === 1 ? '' : 's'}</div>
                <div className={styles.viewToggle}>
                  <button
                    type="button"
                    className={`${styles.viewToggleBtn} ${backupViewMode === 'grid' ? styles.viewToggleBtnActive : ''}`}
                    onClick={() => setBackupViewMode('grid')}
                    aria-label="Grid view"
                  >
                    <GridViewRoundedIcon />
                  </button>
                  <button
                    type="button"
                    className={`${styles.viewToggleBtn} ${backupViewMode === 'list' ? styles.viewToggleBtnActive : ''}`}
                    onClick={() => setBackupViewMode('list')}
                    aria-label="List view"
                  >
                    <ViewListRoundedIcon />
                  </button>
                </div>
              </div>

              {backupsLoading ? (
                <div className={styles.helperText}>Loading backups...</div>
              ) : backups.length === 0 ? (
                <div className={styles.helperText}>No backups yet. Create one to get started.</div>
              ) : (
                <div className={backupViewMode === 'grid' ? styles.backupCardsGrid : styles.backupList}>
                  {backups.map((b) => (
                    <div key={b.id} className={backupViewMode === 'grid' ? styles.backupCard : styles.backupItem}>
                      <div className={styles.backupInfo}>
                        <h4>{formatDate(b.createdAt)}{b.uploadedFrom && <span className={styles.uploadedBadge}>Uploaded</span>}</h4>
                        <span>{(b.collections || []).length} collections &middot; {b.totalDocuments ?? 0} documents &middot; {formatBytes(b.sizeBytes)}</span>
                        {b.uploadedFrom
                          ? <span className={styles.backupTriggeredBy}>From file "{b.uploadedFrom}"{b.triggeredBy?.email ? ` by ${b.triggeredBy.email}` : ''}</span>
                          : b.triggeredBy?.email && <span className={styles.backupTriggeredBy}>By {b.triggeredBy.email}</span>}
                      </div>
                      <div className={styles.backupActions}>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          title="Download backup"
                          onClick={() => handleDownloadBackup(b.id)}
                          disabled={downloadingId === b.id}
                        >
                          <DownloadOutlinedIcon />
                        </button>
                        <button
                          type="button"
                          className={styles.restoreBtn}
                          onClick={() => setRestoreTargetId(b.id)}
                          disabled={restoreJob?.id === b.id}
                        >
                          <RestoreOutlinedIcon />{restoreJob?.id === b.id ? 'Restoring...' : 'Restore'}
                        </button>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          title="Delete backup"
                          onClick={() => setDeleteTargetId(b.id)}
                          disabled={deletingId === b.id || restoreJob?.id === b.id}
                        >
                          <DeleteOutlineIcon />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!backupsLoading && backupTotalPages > 1 && (
                <div className={styles.paginationWrap}>
                  <Pagination shape="rounded" count={backupTotalPages} page={backupPage} onChange={handleBackupPageChange} />
                </div>
              )}

              {restoreTargetId && (
                <div className={styles.backdrop} onClick={() => (restoreJob ? null : setRestoreTargetId(null))}>
                  <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.confirmIcon}><WarningAmberOutlinedIcon /></div>
                    <h3>Restore this backup?</h3>
                    <p>
                      This will permanently replace <strong>all current data</strong> with the backup taken on
                      {' '}{formatDate(backups.find((b) => b.id === restoreTargetId)?.createdAt)}. This action cannot be undone.
                    </p>

                    {restoreJob && (
                      <div className={styles.progressBlock}>
                        <div className={styles.progressLabel}>
                          <span>{jobStatusLabel(restoreJob)}</span>
                          <span>{restoreJob.percent ?? 0}%</span>
                        </div>
                        <LinearProgress variant="determinate" value={restoreJob.percent ?? 0} className={styles.progressBar} color="error" />
                        {restoreJob.docsTotal > 0 && (
                          <div className={styles.progressSubtext}>{restoreJob.docsDone ?? 0} / {restoreJob.docsTotal} documents</div>
                        )}
                      </div>
                    )}

                    <div className={styles.confirmActions}>
                      <button type="button" className={styles.cancelBtn} onClick={() => setRestoreTargetId(null)} disabled={!!restoreJob}>Cancel</button>
                      <button type="button" className={styles.dangerBtn} onClick={() => handleRestoreBackup(restoreTargetId)} disabled={!!restoreJob}>
                        {restoreJob ? 'Restoring...' : 'Yes, Restore'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {deleteTargetId && (
                <div className={styles.backdrop} onClick={() => (deletingId ? null : setDeleteTargetId(null))}>
                  <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.confirmIcon}><DeleteOutlineIcon /></div>
                    <h3>Delete this backup?</h3>
                    <p>
                      This will permanently delete the backup taken on
                      {' '}{formatDate(backups.find((b) => b.id === deleteTargetId)?.createdAt)}{' '}
                      and remove its file from the server. This cannot be undone.
                    </p>
                    <div className={styles.confirmActions}>
                      <button type="button" className={styles.cancelBtn} onClick={() => setDeleteTargetId(null)} disabled={!!deletingId}>Cancel</button>
                      <button type="button" className={styles.dangerBtn} onClick={() => handleDeleteBackup(deleteTargetId)} disabled={!!deletingId}>
                        {deletingId ? 'Deleting...' : 'Yes, Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AppSettings
