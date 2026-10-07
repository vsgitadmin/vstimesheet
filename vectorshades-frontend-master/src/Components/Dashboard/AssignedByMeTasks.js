import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Pagination } from '@mui/material'
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined'
import BookOnlineOutlinedIcon from '@mui/icons-material/BookOnlineOutlined'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import styles from '../../../styles/AssignedByMeTasks.module.css'
import ProfileImage from '../ProfileImage/Image'
import { getAssignedTasksController } from '../../Controllers/projects'
import { toast } from 'react-toastify'

const getStatusKey = (status) => {
    const s = (status || '').toLowerCase()
    if (s === 'completed') return 'Completed'
    if (s === 'in progress') return 'InProgress'
    if (s === 'paused') return 'Paused'
    if (s === 'review') return 'Review'
    if (s === 'queued') return 'Queued'
    if (s === 'due' || s === 'overdue') return 'Overdue'
    return ''
}

const formatDate = (date) =>
    date
        ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'No due date'

const AssignedByMeTasks = () => {
    const router = useRouter()
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageCount, setPageCount] = useState(0)
    const [totalTasks, setTotalTasks] = useState(0)

    const routeTask = (id, section, projectId) => {
        router.push({ pathname: `/admin/dashboard/projects/${projectId}`, query: { taskpopup: id, group: section } })
    }

    const fetchTasks = (p = 1) => {
        setLoading(true)
        getAssignedTasksController({ page: p, project: 'all', filter: { assignedByMe: true } })
            .then(({ data }) => {
                setTasks(data?.response?.data.response ?? [])
                setTotalTasks(data?.response?.data.analytics?.totalTasks ?? 0)
                setCurrentPage(p)
                setLoading(false)
            })
            .catch((err) => {
                console.error(err)
                setLoading(false)
                toast.error("Error occurred while fetching your team's tasks")
            })
    }

    const fetchCount = () => {
        getAssignedTasksController({ page: 0, project: 'count', filter: { assignedByMe: true } })
            .then(({ data }) => setPageCount(data?.response?.data ?? 0))
            .catch((err) => console.error(err))
    }

    useEffect(() => {
        fetchCount()
        fetchTasks(1)
    }, [])

    return (
        <div className={styles.wrapper}>
            <div className={styles.headerRow}>
                <div className={styles.headerText}>
                    <h4>Tasks You've Assigned</h4>
                    <p>Track the work you've handed out to your team</p>
                </div>
                {!loading && <span className={styles.countBadge}>{totalTasks} {totalTasks === 1 ? 'task' : 'tasks'}</span>}
            </div>

            {loading ? (
                <div className={styles.loadingState}>Loading...</div>
            ) : tasks.length > 0 ? (
                <div className={styles.list}>
                    {tasks.map((task) => {
                        const statusKey = getStatusKey(task.status)
                        return (
                            <div
                                key={task._id}
                                className={`${styles.row} ${styles[`accent${statusKey}`] || ''}`}
                                onClick={() => routeTask(task._id, task.section, task.projectId)}
                            >
                                <div className={styles.person}>
                                    <ProfileImage size={32} id={task.assignedTo} />
                                    <div className={styles.names}>
                                        <p className={styles.taskName}>{task.name}</p>
                                        <p className={styles.assigneeName}>{task.assignedToName}</p>
                                    </div>
                                </div>
                                <div className={styles.meta}>
                                    <span className={styles.projectTag}>
                                        <BookOnlineOutlinedIcon />
                                        {task.projectName || '-'}
                                    </span>
                                    <span className={styles.dueDate}>
                                        <EventOutlinedIcon />
                                        {formatDate(task.dueDate)}
                                    </span>
                                    <span className={`${styles.statusPill} ${styles[`status${statusKey}`] || ''}`}>{task.status}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <AssignmentIndOutlinedIcon />
                    <h4>You haven't assigned any tasks yet</h4>
                </div>
            )}

            {pageCount > 1 && (
                <div className={styles.paginationWrap}>
                    <Pagination shape="rounded" count={pageCount} page={currentPage} onChange={(e, v) => fetchTasks(v)} />
                </div>
            )}
        </div>
    )
}

export default AssignedByMeTasks
