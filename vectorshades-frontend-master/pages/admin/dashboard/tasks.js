import { Pagination } from '@mui/material';
import styles from '../../../styles/Project.module.css'
import ProfileImage from '../../../src/Components/ProfileImage/Image';
import { useContext, useEffect, useState } from 'react';
import { ParentStore } from '../../_app';
import { useRouter } from 'next/router';
import taskStyles from "../../../styles/ActiveTasks.module.css";
import { getAssignedTasksController } from '../../../src/Controllers/projects';
import { AlarmOn, BookOnlineOutlined, CheckBox, DataObjectOutlined, Person, Schedule } from '@mui/icons-material';
import EventIcon from '@mui/icons-material/Event';        // <-- Import the MUI Event icon
import { toast } from 'react-toastify';                  // optional: if you use toast elsewhere
import SelectUserInput from '../../../src/Components/SelectUserInput';

const Tasks = () => {
    const { ParentState } = useContext(ParentStore)
    const [taskPopup, setTaskPopup] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [selectedID, setSelectedID] = useState(0);
    const [statusFilter, setstatusFilter] = useState()
    const [User, setUser] = useState()
    const [analytics, setanalytics] = useState({})
    const router = useRouter()
    const [currentPage, setCurrentPage] = useState(1)
    const [pageCount, setPageCount] = useState(0)
    const [selectedTask, setSelectedTask] = useState()
    const [Loading, setLoading] = useState(false)

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

    return (<>
        <div className={styles.pro_container}>
            <div className={styles.pro_left}>
                <div className={styles.pro_top}>
                    <div className="head">
                        <h1>Tasks</h1>
                    </div>
                    <p className='mt_1 grey'>Access and manage all listed projects here</p>
                </div>
                <div className={taskStyles.tasks_boxes} style={{ marginLeft: '40px' }}>
                    <div className='job_month_analytics'>
                        <div className='job_analytics_title'>
                            <h3>Total Tasks</h3>
                            <h2>{analytics?.totalTasks ?? 0}</h2>
                        </div>

                        <div className='job_analytics_title'>
                            <h3>In Progress</h3>
                            <h2>{analytics?.inProgress ?? 0}</h2>
                        </div>

                        <div className='job_analytics_title'>
                            <h3>Completed</h3>
                            <h2>{analytics?.completed ?? 0}</h2>
                        </div>

                        {/* paused */}
                        <div className='job_analytics_title'>
                            <h3>Paused</h3>
                            <h2>{analytics?.paused ?? 0}</h2>
                        </div>

                        {/* review */}
                        <div className='job_analytics_title'>
                            <h3>Review</h3>
                            <h2>{analytics?.review ?? 0}</h2>
                        </div>

                        {/* queued */}
                        <div className='job_analytics_title'>
                            <h3>Queued</h3>
                            <h2>{analytics?.queued ?? 0}</h2>
                        </div>

                        {/* overdue */}
                        <div className='job_analytics_title'>
                            <h3>Overdue</h3>
                            <h2>{analytics?.overdue ?? 0}</h2>
                        </div>
                    </div>
                    <div className={taskStyles.filter_main}>
                        <select className='year_select_dropdown'
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
                        {ParentState?.auth?.role === 'SA' && <div style={{ display: 'flex', alignItems: 'center' }}>
                            <SelectUserInput returnUser={(user) => setUser(user._id)} label={'Assigned To'} />
                        </div>}


                    </div>
                    {Loading && <div style={{ padding: 12 }}>Loading...</div>}
                    {tasks.map((data, i) => {
                        const { createdAt, updatedAt, taskIndex , projectName } = data || {};
                        const formatDate = (date) =>
                            new Date(date)
                                .toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })
                                .replace(",", "");
                        const created_at = createdAt ? formatDate(createdAt) : '-';
                        const updated_at = updatedAt ? formatDate(updatedAt) : '-';
                        return (
                            <div
                                key={data?._id ?? i}
                                onClick={() => {
                                    setSelectedID(data._id);
                                    setSelectedTask(data)
                                    setTaskPopup(true);
                                    routeTask(data._id, data.section, data.projectId)
                                }}
                                className={taskStyles.tasks_box}
                            >
                                <div className={taskStyles.tb_1}>
                                    <div>
                                        <ProfileImage size={'100%'} id={data.assignedTo} />
                                    </div>
                                </div>
                                <div className={taskStyles.tb_3}>
                                    <div className={taskStyles.tb_title} >
                                        <h4>{data.name}</h4>
                                        {data.completed === true &&
                                            <div className={taskStyles.labels} >Completed</div>
                                        }
                                    </div>
                                    <div className={taskStyles.tb_3_ac}>
                                        <div>
                                            <div>
                                                <Person style={{ fill: "grey", fontSize: "18px" }} />
                                                <h4>Assigned To</h4>
                                            </div>
                                            <h5>{data.assignedToName}</h5>
                                        </div>

                                        <div>
                                            <div>
                                                <Schedule
                                                    style={{ fill: "grey", fontSize: "15px" }}
                                                />
                                            </div>
                                            <h5>{data.allocatedHours}h</h5>
                                        </div>
                                        <div>
                                            <div>
                                                <AlarmOn style={{ fill: "grey", fontSize: "15px" }} />
                                            </div>
                                            <h5>{parseInt(data.completedHours) || 0}h</h5>
                                        </div>
                                        <div>
                                            <div>
                                                <DataObjectOutlined style={{ fill: "grey", fontSize: "16px" }} />
                                            </div>
                                            <h5>#{taskIndex}</h5>
                                        </div>
                                        <div>
                                            <div>
                                                <EventIcon style={{ fill: "grey", fontSize: "15px" }} />
                                                <h4>Created At</h4>
                                            </div>
                                            <h5>{created_at}</h5>
                                        </div>
                                        <div>
                                            <div>
                                                <BookOnlineOutlined style={{ fill: "grey", fontSize: "15px" }} />
                                                <h4>Project</h4>
                                            </div>
                                            <h5>{projectName.slice(0,17)}...</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className={taskStyles.tb_5}>
                                    <div>
                                        <h5>{data.status}</h5>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className='project_pagination' >
                    <Pagination
                        count={pageCount}
                        page={currentPage}
                        onChange={(e, v) => fetchYourTasks(v)}
                        className='pagination-center'
                    />
                </div>
            </div>
        </div>
    </>)
}

export default Tasks
