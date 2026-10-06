import { Pagination } from '@mui/material';
import styles from '../../../styles/TasksPage.module.css'
import ProfileImage from '../../../src/Components/ProfileImage/Image';
import { useContext, useEffect, useState } from 'react';
import { ParentStore } from '../../_app';
import { useRouter } from 'next/router';
import { getAssignedTasksController } from '../../../src/Controllers/projects';
import { AssignmentOutlined, BookOnlineOutlined, DataObjectOutlined, Person, Schedule } from '@mui/icons-material';
import AssignmentLateOutlinedIcon from '@mui/icons-material/AssignmentLateOutlined';
import HourglassBottomOutlinedIcon from '@mui/icons-material/HourglassBottomOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import PauseCircleOutlinedIcon from '@mui/icons-material/PauseCircleOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import EventIcon from '@mui/icons-material/Event';
import InboxIcon from '@mui/icons-material/Inbox';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import { toast } from 'react-toastify';
import SelectUserInput from '../../../src/Components/SelectUserInput';
import { useViewMode } from '../../../src/Hooks/useViewMode';

const STAT_TILES = [
    { key: 'totalTasks', label: 'Total Tasks', icon: <AssignmentLateOutlinedIcon />, color: '#555', bg: '#f0f0f0' },
    { key: 'inProgress', label: 'In Progress', icon: <HourglassBottomOutlinedIcon />, color: '#2979ff', bg: 'rgba(41, 121, 255, 0.13)' },
    { key: 'completed', label: 'Completed', icon: <CheckCircleOutlinedIcon />, color: '#2e9e5b', bg: 'rgba(46, 158, 91, 0.14)' },
    { key: 'paused', label: 'Paused', icon: <PauseCircleOutlinedIcon />, color: '#e08600', bg: 'rgba(255, 152, 0, 0.15)' },
    { key: 'review', label: 'Review', icon: <RateReviewOutlinedIcon />, color: '#9c27b0', bg: 'rgba(156, 39, 176, 0.13)' },
    { key: 'queued', label: 'Queued', icon: <PendingActionsOutlinedIcon />, color: '#6b6b6b', bg: 'rgba(120, 120, 120, 0.14)' },
    { key: 'overdue', label: 'Overdue', icon: <ReportProblemOutlinedIcon />, color: 'var(--redTheme)', bg: 'rgba(255, 99, 99, 0.14)' },
]

// Maps a task's raw status string to the matching pill/accent-bar style key.
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
        ? new Date(date)
            .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            .replace(",", "")
        : '-';

const Tasks = () => {
    const { ParentState } = useContext(ParentStore)
    const [tasks, setTasks] = useState([]);
    const [statusFilter, setstatusFilter] = useState()
    const [User, setUser] = useState()
    const [analytics, setanalytics] = useState({})
    const router = useRouter()
    const [currentPage, setCurrentPage] = useState(1)
    const [pageCount, setPageCount] = useState(0)
    const [Loading, setLoading] = useState(false)
    const [viewMode, setViewMode] = useViewMode()

    const routeTask = (id, section, projectId) => { router.push({ pathname: `/admin/dashboard/projects/${projectId}`, query: { taskpopup: id, group: section } }); }

    const fetchYourTasks = (p = 1) => {
        setLoading(true);
        getAssignedTasksController({ page: p, project: 'all', filter: { statusFilter, assignedTo: User } })
            .then(({ data }) => {
                // defensive access - depends on your API shape
                setTasks(data?.response?.data.response ?? []);
                setanalytics(data?.response?.data.analytics)
                setLoading(false);
                setCurrentPage(p);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
                toast.error("Error occurred while fetching tasks");
            });
    }

    const fetchCount = () => {
        getAssignedTasksController({ page: 0, project: 'count', filter: { statusFilter, assignedTo: User } })
            .then(({ data }) => {
                // depends on what API returns here — adjust if you get total items vs pages
                setPageCount(data?.response?.data ?? 0)
            })
            .catch((err) => {
                console.error(err);
                toast.error("Error occurred while fetching tasks");
            });
    }

    useEffect(() => {
        fetchCount()
        fetchYourTasks(1)
    }, [statusFilter, User])

    const TaskMeta = ({ data, taskIndex, projectName, created_at }) => (
        <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
                <div className={styles.metaLabel}><Person style={{ fontSize: "14px" }} />Assigned To</div>
                <h5>{data.assignedToName}</h5>
            </div>
            <div className={styles.metaItem}>
                <div className={styles.metaLabel}><Schedule style={{ fontSize: "14px" }} />Allocated / Done</div>
                <h5>{data.allocatedHours}h / {parseInt(data.completedHours) || 0}h</h5>
            </div>
            <div className={styles.metaItem}>
                <div className={styles.metaLabel}><DataObjectOutlined style={{ fontSize: "14px" }} />Task ID</div>
                <h5>#{taskIndex}</h5>
            </div>
            <div className={styles.metaItem}>
                <div className={styles.metaLabel}><EventIcon style={{ fontSize: "14px" }} />Created At</div>
                <h5>{created_at}</h5>
            </div>
            <div className={styles.metaItem} style={{ gridColumn: '1 / -1' }}>
                <div className={styles.metaLabel}><BookOnlineOutlined style={{ fontSize: "14px" }} />Project</div>
                <h5>{(projectName || '').slice(0, 30)}{(projectName || '').length > 30 ? '...' : ''}</h5>
            </div>
        </div>
    )

    return (<>
        <section className={styles.page}>
            <div className={styles.headerRow}>
                <div className={styles.titleBlock}>
                    <h1><span className={styles.titleIcon}><AssignmentOutlined /></span>Tasks</h1>
                    <p className={styles.subtitle}>Access and manage all listed projects here</p>
                </div>
            </div>

            <div className={styles.statsRow}>
                {STAT_TILES.map((tile) => (
                    <div className={styles.statTile} key={tile.key}>
                        <span className={styles.statIcon} style={{ color: tile.color, background: tile.bg }}>{tile.icon}</span>
                        <div>
                            <h3>{tile.label}</h3>
                            <h2>{analytics?.[tile.key] ?? 0}</h2>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.toolbar}>
                <div className={styles.filterField}>
                    <label>Status</label>
                    <select
                        className={styles.statusSelect}
                        onChange={(e) => setstatusFilter(e.target.value)}
                    >
                        <option disabled value={null}>Select Status</option>
                        <option value={'In Progress'}>In Progress</option>
                        <option value={'queued'}>Queue</option>
                        <option value={'Paused'}>Paused</option>
                        <option value={'Due'}>Overdue</option>
                        <option value={'Review'}>Review</option>
                        <option value={'Completed'}>Completed</option>
                    </select>
                </div>

                {ParentState?.auth?.role === 'SA' &&
                    <div className={styles.assignedToBox}>
                        <SelectUserInput returnUser={(user) => setUser(user._id)} label={'Assigned To'} />
                    </div>
                }

                <div className={styles.viewToggle}>
                    <button
                        type="button"
                        className={`${styles.viewToggleBtn} ${viewMode === 'grid' ? styles.viewToggleBtnActive : ''}`}
                        onClick={() => setViewMode('grid')}
                        aria-label="Grid view"
                    >
                        <GridViewRoundedIcon />
                    </button>
                    <button
                        type="button"
                        className={`${styles.viewToggleBtn} ${viewMode === 'list' ? styles.viewToggleBtnActive : ''}`}
                        onClick={() => setViewMode('list')}
                        aria-label="List view"
                    >
                        <ViewListRoundedIcon />
                    </button>
                </div>
            </div>

            {Loading ? (
                <div className={styles.loadingState}>Loading...</div>
            ) : tasks.length > 0 ? (
                viewMode === 'grid' ? (
                    <div className={styles.cardsGrid}>
                        {tasks.map((data, i) => {
                            const { createdAt, taskIndex, projectName } = data || {};
                            const created_at = formatDate(createdAt);
                            const statusKey = getStatusKey(data.status);
                            return (
                                <div
                                    className={`${styles.card} ${styles[`accent${statusKey}`] || ''}`}
                                    key={data?._id ?? i}
                                    onClick={() => routeTask(data._id, data.section, data.projectId)}
                                >
                                    <div className={styles.cardTop}>
                                        <div className={styles.person}>
                                            <ProfileImage size={45} id={data.assignedTo} />
                                            <div>
                                                <h4>{data.name}</h4>
                                                <h5>{projectName}</h5>
                                            </div>
                                        </div>
                                        <span className={`${styles.statusPill} ${styles[`status${statusKey}`] || ''}`}>{data.status}</span>
                                    </div>
                                    <TaskMeta data={data} taskIndex={taskIndex} projectName={projectName} created_at={created_at} />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className={styles.rowsList}>
                        {tasks.map((data, i) => {
                            const { createdAt, taskIndex, projectName } = data || {};
                            const created_at = formatDate(createdAt);
                            const statusKey = getStatusKey(data.status);
                            return (
                                <div
                                    className={`${styles.row} ${styles[`accent${statusKey}`] || ''}`}
                                    key={data?._id ?? i}
                                    onClick={() => routeTask(data._id, data.section, data.projectId)}
                                >
                                    <div className={styles.rowPerson}>
                                        <ProfileImage size={44} id={data.assignedTo} />
                                        <div>
                                            <h4>{data.name}</h4>
                                            <h5>{data.assignedToName}</h5>
                                        </div>
                                    </div>
                                    <div className={styles.rowMeta}>
                                        <span><Schedule style={{ fontSize: "15px" }} />{data.allocatedHours}h / {parseInt(data.completedHours) || 0}h</span>
                                        <span><DataObjectOutlined style={{ fontSize: "15px" }} />#{taskIndex}</span>
                                        <span><EventIcon style={{ fontSize: "15px" }} />{created_at}</span>
                                        <span><BookOnlineOutlined style={{ fontSize: "15px" }} />{(projectName || '').slice(0, 17)}{(projectName || '').length > 17 ? '...' : ''}</span>
                                    </div>
                                    <div className={styles.rowRight}>
                                        <span className={`${styles.statusPill} ${styles[`status${statusKey}`] || ''}`}>{data.status}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )
            ) : (
                <div className={styles.emptyState}>
                    <InboxIcon />
                    <h4>No tasks found</h4>
                    <p>Try adjusting the status or assigned-to filter</p>
                </div>
            )}

            <div className={styles.paginationWrap}>
                <Pagination
                    shape="rounded"
                    count={pageCount}
                    page={currentPage}
                    onChange={(e, v) => fetchYourTasks(v)}
                />
            </div>
        </section>
    </>)
}

export default Tasks
