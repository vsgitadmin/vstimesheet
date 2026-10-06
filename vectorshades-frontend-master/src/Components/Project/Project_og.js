import {
    AccessTime,
    BarChart,
    Description,
    Domain,
    MoreVert,
    Timeline,
    Info,
    SupervisorAccount,
    Person,
    People,
    Schedule,
    Update,
    Star,
    ReplayOutlined
} from '@mui/icons-material'
import { Avatar, AvatarGroup, Fade, Grow, Slide, Tooltip } from '@mui/material'
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
import BarChartIcon from '@mui/icons-material/BarChart';
import { searchProjectController } from '../../Controllers/projects/index'
import { ParentStore } from '../../../pages/_app'
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import ReportView from '../General/ReportView.js'
import YearMonthSelector from '../Inputs/YearMonthSelector.js'

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

    const projectMap = projects.map((data) => {
        const { createdAt, updatedAt } = data;
        const formatDate = date => new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).replace(',', '');
        const created_at = formatDate(createdAt);
        const updated_at = formatDate(updatedAt);
        return (

            <div onClick={() => router.push(`/admin/dashboard/projects/${data._id}`)} className={styles.pro_card}>
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
                                return <ProfileImage id={i._id} />
                            })}
                        </AvatarGroup>
                    </div>



                    <div className={styles.pro_item} style={{ width: "100%", marginTop: "13px" }} onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/admin/dashboard/projects/summary/${data._id}`)
                    }}>
                    </div>

                    <div className={styles.labels}>
                        {data.completed === true && <span style={{ background: "green" }}>Completed</span>}
                        {data.completed === false && <span style={{ background: "grey" }}>In Progress</span>}
                        {data.active === false && <span style={{ background: "red" }}>Not Active</span>}
                    </div>
                </div>
                {/* <div className={styles.pro_desc} >
                    <h4><Description /> Description</h4>
                    <p>{data.description}</p>
                </div> */}
            </div>


        )
    })

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
                    <div className="head">
                        <h1>Projects</h1>
                    </div>
                    <p className='mt_1 grey'>Access and manage all listed projects here</p>
                    {ParentState?.auth.role === "SA" &&
                        <p className='grey'>All projects listed here, track all assigned tasks and more</p>}
                </div>
                <div className={styles.pro_filter}>
                    <div className={styles.pro_filter_search}>
                        <input type="text" placeholder='Search' onChange={searchProjectsFunction} />
                        <YearMonthSelector month={month} year={year} handleMonthChange={(month) => setmonth(month)} handleYearChange={(year) => setyear(year)} />
                        <ReplayOutlined onClick={() => {
                            setmonth(null)
                            setyear(null)
                        }} key={[month, year]} style={{ fill: "grey", display: month == null && year == null ? 'none' : 'block' }} />

                    </div>

                    {['SA', 'RB', 'STL'].includes(ParentState?.auth.role) && <div style={{ display: 'flex' }}>
                        <div className={styles.ar_accept_review_btn} >
                            <button onClick={() => generateProdHrsReport()}>HRS</button>
                        </div>
                        <div className={styles.ar_accept_review_btn} >
                            <button onClick={() => generateProdBillingReport()}>BILLING</button>
                        </div>
                    </div>}


                </div>
                <>
                    <div className={styles.pro_cards}>
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
                        <div><h5>Total projects:</h5></div>
                        <div><h4 style={{ borderLeft: "3px solid violet" }}>{analytics?.projectStatus?.total}</h4>
                        </div>
                    </div>
                    <div className={styles.pro_right_det_box}>
                        <div><h5>Completed:</h5></div>
                        <div><h4 style={{ borderLeft: "3px solid green" }}>{analytics?.projectStatus?.completed}</h4>
                        </div>
                    </div>
                    <div className={styles.pro_right_det_box}>
                        <div><h5>In progress:</h5></div>
                        <div><h4
                            style={{ borderLeft: "3px solid yellow" }}>{analytics?.projectStatus?.in_progress}</h4>
                        </div>
                    </div>
                    <div className={styles.pro_right_det_box}>
                        <div><h5>Out of schedule:</h5></div>
                        <div><h4 style={{ borderLeft: "3px solid red" }}>{analytics?.projectStatus?.not_active}</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ReportView ref={reportViewRef} />
    </>)
}

export default Project