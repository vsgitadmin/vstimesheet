import {
    AccessTime,
    Domain,
    Timeline,
    Info,
    SupervisorAccount,
    Person,
    People,
    Schedule,
    Update,
    ReplayOutlined
} from '@mui/icons-material'
import { AvatarGroup, Tooltip } from '@mui/material'
import { useState, useEffect, useContext, useRef } from 'react'
import styles from '../../../styles/Project.module.css'
import CreateProjectPopup from '../Popups/Project/CreateProjectPopup.js'
import {
    getAllProjectsController,
    createProjectController,
    getProjectListAnalyticsController,
    generateProjectReportsController,
    getSingleTasksController
} from '../../Controllers/projects/index'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import ProfileImage from '../ProfileImage/Image'
import { Pagination } from '@mui/material'
import { getTotalNumberOfUserProjects } from '../../../src/Controllers/projects/index'
import BarChartIcon from '@mui/icons-material/BarChart'
import { searchProjectController } from '../../Controllers/projects/index'
import { ParentStore } from '../../../pages/_app'
import ReportView from '../General/ReportView.js'
import YearMonthSelector from '../Inputs/YearMonthSelector.js'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { useViewMode } from '../../Hooks/useViewMode'

const Project = () => {
    const [createProjectPopupEnabled, setcreateProjectPopupEnabled] = useState(false);
    const [projects, setprojects] = useState([])
    const [analytics, setAnalytics] = useState({})
    const [year, setyear] = useState(null)
    const [month, setmonth] = useState(null)
    const [pageCount, setPageCount] = useState()
    const router = useRouter()
    const { ParentState } = useContext(ParentStore)
    const [currentPage, setCurrentPage] = useState(1)
    const [searching, setSearching] = useState(false)
    const [animState, setAnimState] = useState(false)
    const [viewMode, setViewMode] = useViewMode()
    const reportViewRef = useRef()

    useEffect(() => {
        InitialHydration()
    }, [])

    useEffect(() => {
        fetchProjects(null)
    }, [currentPage]);

    useEffect(() => {
        fetchProjects()
    }, [month, year])


    const generateProdHrsReport = async () => {
        reportViewRef.current.openView(generateProjectReportsController, { type: 'ProjectProductionList', key: 'Project Production' })
    }

    const generateProdBillingReport = async () => {
        reportViewRef.current.openView(generateProjectReportsController, { type: 'ProjectProductionBilling', key: 'Project Production Billing ' })
    }

    const fetchProjects = (sort) => {
        getAllProjectsController(sort ? { ...sort, page: currentPage, month, year } : { sort: null, page: currentPage, month, year })
            .then((data) => {
                setprojects(data?.data?.response?.data)
                setAnimState(true)
            })
            .catch((err) => {
                console.log(err);
                toast.error("error occured while fetching the projects")
            })
    }

    const InitialHydration = (sort) => {
        getTotalNumberOfUserProjects()
            .then((response) => {
                const pageCount = response.data.response.count / 6
                setPageCount(Math.ceil(pageCount))
            })

        fetchProjects(sort)
        getProjectListAnalyticsController()
            .then((data) => {
                setAnalytics(data?.data?.response?.data)
            })
            .catch((err) => {
                console.log(err);
                toast.error("error occured while fetching the projects")
            })
    }


    const createProjectFunction = (data) => {
        createProjectController(data).then(() => {
            toast.success("project created successfully")
            setcreateProjectPopupEnabled(false)
            InitialHydration()
        })
            .catch((err) => {
                console.log(err);
                toast.error("error occured while creating project")
            })
    }

    const onPageChange = (event, value) => {
        setAnimState(false)
        setTimeout(() => {
            setCurrentPage(value)
        }, 100)
    }

    const searchProjectsFunction = async (e) => {
        try {
            if (e.target.value === '') {
                setSearching(false)
                fetchProjects()
            } else {
                const { data } = await searchProjectController({ search: e.target.value })
                setprojects(data.response.data)
                setSearching(true)
            }
        } catch {
            toast.error("Project search failed")
        }
    }

    const formatProjectDate = date => new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).replace(',', '');

    // one place to decide the label + color for a project's status badge,
    // so grid cards, list rows, and any future "other" status all agree
    const getStatusBadge = (data) => {
        if (data.active === false) return { label: 'Not Active', cls: styles.badge_danger }
        if (data.completed === true) return { label: 'Completed', cls: styles.badge_success }
        if (data.completed === false) return { label: 'In Progress', cls: styles.badge_warning }
        return { label: data.status || 'Unknown', cls: styles.badge_default }
    }

    const renderProjectCard = (data) => {
        const created_at = formatProjectDate(data.createdAt);
        return (
            <div key={data._id} onClick={() => router.push(`/admin/dashboard/projects/${data._id}`)} className={styles.pro_card}>
                <div className={styles.pro_name}>
                    <h2>{data.projectName}</h2>
                    {ParentState?.auth.role !== 'EMP' && <Tooltip title="Project Summary" >
                        <span onClick={(e) => {
                            e.stopPropagation(); router.push(`/admin/dashboard/projects/summary/${data._id}`)
                        }}> <BarChartIcon />
                        </span>
                    </Tooltip>}
                </div>
                <div className={styles.pro_items}>
                    <div className={styles.pro_item}>
                        <h5><Domain style={{ fill: "grey" }} />Client</h5>
                        <h5>{data.client}</h5>
                    </div>
                    <div className={styles.pro_item}>
                        <h5><AccessTime style={{ fill: "grey" }} />Hours</h5>
                        <h5>{parseFloat(data.hours).toFixed(2)} Hours</h5>
                    </div>
                    <div className={styles.pro_item}>
                        <h5><Timeline style={{ fill: "grey" }} />Est Hours</h5>
                        <h5>{data.estimatedHours} Hours</h5>
                    </div>
                    <div className={styles.pro_item}>
                        <h5><Info style={{ fill: "grey" }} />Status</h5>
                        <h5>{data.status}</h5>
                    </div>
                    <div className={styles.pro_item}>
                        <h5><SupervisorAccount style={{ fill: "grey" }} />Admin</h5>
                        <h5>{data.admin}</h5>
                    </div>
                    <div className={styles.pro_item}>
                        <h5><Person style={{ fill: "grey" }} />Created By</h5>
                        <h5>{data.createdBy}</h5>
                    </div>
                    <div className={styles.pro_item}>
                        <h5><Schedule style={{ fill: "grey" }} />Created At</h5>
                        <h5>{created_at}</h5>
                    </div>
                    <div className={styles.pro_item} >
                        <h5><Update style={{ fill: "grey" }} />Project Type</h5>
                        <h5>{data.rebar ? 'REBAR' : 'STEEL'}</h5>
                    </div>

                    <div className={styles.pro_item} style={{ width: "100%", marginTop: "13px" }}>
                        <h5><People style={{ fill: "grey" }} />Members</h5>
                        <AvatarGroup max={6} sx={{ '& .MuiAvatar-root': { width: 30, height: 30, fontSize: 15 }, }}>
                            {data.membersByName.map((i) => {
                                return <ProfileImage id={i._id} key={i._id} />
                            })}
                        </AvatarGroup>
                    </div>

                    <div className={styles.labels}>
                        <span className={`${styles.badge} ${getStatusBadge(data).cls}`}>{getStatusBadge(data).label}</span>
                    </div>
                </div>
            </div>
        )
    }

    const renderProjectRow = (data) => {
        const created_at = formatProjectDate(data.createdAt);
        return (
            <div key={data._id} onClick={() => router.push(`/admin/dashboard/projects/${data._id}`)} className={styles.pro_row}>
                <div className={styles.pro_row_top}>
                    <div className={styles.pro_row_title}>
                        <h3>{data.projectName}</h3>
                        <span className={styles.pro_type_badge}>{data.rebar ? 'REBAR' : 'STEEL'}</span>
                    </div>
                    <div className={styles.pro_row_top_right}>
                        <div className={styles.labels}>
                            <span className={`${styles.badge} ${getStatusBadge(data).cls}`}>{getStatusBadge(data).label}</span>
                        </div>
                        {ParentState?.auth.role !== 'EMP' && <Tooltip title="Project Summary">
                            <span className={styles.pro_row_summary_btn} onClick={(e) => {
                                e.stopPropagation(); router.push(`/admin/dashboard/projects/summary/${data._id}`)
                            }}>
                                <BarChartIcon fontSize="small" />
                            </span>
                        </Tooltip>}
                    </div>
                </div>
                <div className={styles.pro_row_stats}>
                    <div className={styles.pro_row_stat}><Domain style={{ fill: "grey" }} fontSize="small" /><span>{data.client}</span></div>
                    <div className={styles.pro_row_stat}><AccessTime style={{ fill: "grey" }} fontSize="small" /><span>{parseFloat(data.hours).toFixed(2)} Hours</span></div>
                    <div className={styles.pro_row_stat}><Timeline style={{ fill: "grey" }} fontSize="small" /><span>Est {data.estimatedHours} Hours</span></div>
                    <div className={styles.pro_row_stat}><SupervisorAccount style={{ fill: "grey" }} fontSize="small" /><span>{data.admin}</span></div>
                    <div className={styles.pro_row_stat}><Person style={{ fill: "grey" }} fontSize="small" /><span>{data.createdBy}</span></div>
                    <div className={styles.pro_row_stat}><Schedule style={{ fill: "grey" }} fontSize="small" /><span>{created_at}</span></div>
                </div>
                <div className={styles.pro_row_bottom}>
                    <AvatarGroup max={6} sx={{ '& .MuiAvatar-root': { width: 26, height: 26, fontSize: 13 }, }}>
                        {data.membersByName.map((i) => {
                            return <ProfileImage id={i._id} key={i._id} />
                        })}
                    </AvatarGroup>
                </div>
            </div>
        )
    }

    const projectMap = projects.map((data) => viewMode === 'grid' ? renderProjectCard(data) : renderProjectRow(data))

    const routeTask = (id, section, projectId) => { router.push({ pathname: `/admin/dashboard/projects/${projectId}`, query: { taskpopup: id, group: section } }); }


    const routeTaskIndex = async (t) => {
        const taskId = parseInt(t)
        const {data} = await getSingleTasksController({index:taskId})
        const taskData = data.response.data
        if(!taskData._id) toast.warning('NO TASK FOUND')
        else routeTask(taskData._id,taskData.section,taskData.projectId)
    }

    useEffect(() => {
        if (!router.isReady) return;
        const t = router.query.task;
        if (t) routeTaskIndex(Array.isArray(t) ? t[0] : t);
    }, [router.isReady, router.query.task]);


    return (<>
        <CreateProjectPopup proPopup={createProjectPopupEnabled} setProPopup={setcreateProjectPopupEnabled}
            submit={createProjectFunction} />
        <div className={styles.pro_container}>
            <div className={styles.pro_left}>
                <div className={styles.pro_top}>
                    <h1><span className={styles.pro_title_icon}><FolderOutlinedIcon /></span>Projects</h1>
                    <p className='mt_1 grey'>Access and manage all listed projects here</p>
                    {ParentState?.auth.role === "SA" &&
                        <p className='grey'>All projects listed here, track all assigned tasks and more</p>}
                </div>
                <div className={styles.pro_filter}>
                    <div className={styles.pro_filter_search}>
                        <div className={styles.pro_search_box}>
                            <SearchOutlinedIcon />
                            <input type="text" placeholder='Search projects...' onChange={searchProjectsFunction} />
                        </div>
                        <YearMonthSelector month={month} year={year} handleMonthChange={(month) => setmonth(month)} handleYearChange={(year) => setyear(year)} />
                        <ReplayOutlined onClick={() => {
                            setmonth(null)
                            setyear(null)
                        }} key={[month, year]} style={{ fill: "grey", display: month == null && year == null ? 'none' : 'block', cursor: 'pointer' }} />
                    </div>

                    <div className={styles.pro_toolbar_right}>
                        <div className={styles.pro_view_toggle}>
                            <Tooltip title="Grid view">
                                <button
                                    type="button"
                                    className={`${styles.pro_view_toggle_btn} ${viewMode === 'grid' ? styles.pro_view_toggle_btn_active : ''}`}
                                    onClick={() => setViewMode('grid')}
                                    aria-label="Grid view"
                                >
                                    <GridViewRoundedIcon />
                                </button>
                            </Tooltip>
                            <Tooltip title="List view">
                                <button
                                    type="button"
                                    className={`${styles.pro_view_toggle_btn} ${viewMode === 'list' ? styles.pro_view_toggle_btn_active : ''}`}
                                    onClick={() => setViewMode('list')}
                                    aria-label="List view"
                                >
                                    <ViewListRoundedIcon />
                                </button>
                            </Tooltip>
                        </div>

                        {['SA', 'RB', 'STL'].includes(ParentState?.auth.role) && <div className={styles.ar_accept_review_btn} >
                            <button onClick={() => generateProdHrsReport()}>HRS</button>
                            <button onClick={() => generateProdBillingReport()}>BILLING</button>
                        </div>}
                    </div>
                </div>
                <>
                    <div className={viewMode === 'grid' ? styles.pro_cards : styles.pro_list}>
                        {projectMap}
                    </div>
                    {2 > 1 && <div className='project_pagination'>
                        {!searching && <Pagination count={pageCount} onChange={onPageChange} />}
                    </div>}
                </>
            </div>
            <div className={styles.pro_right}>
                <div className={styles.pro_profile}>
                    <h3>Your Analytics</h3>
                    <p>Check your over all project analytics</p>
                </div>
                <div className={styles.border_bottom}></div>
                <div className={styles.pro_right_det}>
                    <div className={styles.pro_right_det_box}>
                        <span className={styles.pro_stat_icon} style={{ background: '#8b5cf6' }}><FolderOutlinedIcon /></span>
                        <div><h5>Total projects</h5><h4>{analytics?.projectStatus?.total}</h4></div>
                    </div>
                    <div className={styles.pro_right_det_box}>
                        <span className={styles.pro_stat_icon} style={{ background: '#2e9e5b' }}><CheckCircleOutlineIcon /></span>
                        <div><h5>Completed</h5><h4>{analytics?.projectStatus?.completed}</h4></div>
                    </div>
                    <div className={styles.pro_right_det_box}>
                        <span className={styles.pro_stat_icon} style={{ background: '#d98a00' }}><HourglassBottomIcon /></span>
                        <div><h5>In progress</h5><h4>{analytics?.projectStatus?.in_progress}</h4></div>
                    </div>
                    <div className={styles.pro_right_det_box}>
                        <span className={styles.pro_stat_icon} style={{ background: 'var(--redTheme)' }}><ErrorOutlineIcon /></span>
                        <div><h5>Out of schedule</h5><h4>{analytics?.projectStatus?.not_active}</h4></div>
                    </div>
                </div>
            </div>
        </div>
        <ReportView ref={reportViewRef} />
    </>)
}

export default Project
