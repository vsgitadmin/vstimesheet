import React, { useState, useEffect, useContext } from 'react';
import { AccountBalanceOutlined, BadgeOutlined, CheckCircleOutline, CreditCardOutlined, FiberManualRecord, IosShare, KeyboardArrowDown, MonetizationOnOutlined, MoreVertOutlined, Moving, PauseCircleOutlineOutlined, PlayArrowOutlined, PlayCircleOutlineOutlined, ShareOutlined, Task, Tune, WorkHistoryOutlined } from '@mui/icons-material'
import { toast } from 'react-toastify';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getEmployeeDashboardController } from '../../Controllers/Employee/index'
import ProfileImage from '../ProfileImage/Image'
import Loader from '../Loader/loader';
import styles from '../../../styles/Employee.module.css'
import style from '../../../styles/Hr.module.css'
import styl from '../../../styles/Finance.module.css'
import DateToMonthYear from '../../Helpers/General/DateToMonthYear';
import Months from '../../Constants/months'
import { ParentStore } from '../../../pages/_app'
import PauseIcon from '@mui/icons-material/Pause';
import { IconButton } from '@mui/material';
import { editSingleTasksController, updateTaskActivityController } from '../../Controllers/projects';
import { getAllTraining } from "../../Controllers/LMS/index"
import { useRouter } from 'next/router'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const EmpAnalytics = ({ query, fromProfile }) => {
    const [EmployeeData, setEmployeeData] = useState(null)
    const [lmsData, setLmsData] = useState([])
    const [Loading, setLoading] = useState(true);
    const [MapData, setMapData] = useState([])
    const { ParentState } = useContext(ParentStore);
    const router = useRouter()

    useEffect(() => {
        try {
            fetchInitialData()
        } catch (err) {
            toast.error('failed to load data')
        }
    }, [])

    const fetchInitialData = () => {
        getEmployeeDashboardController(query ? { id: query } : null).then(({ data }) => {
            setEmployeeData(data.response.data)
            const chartMap = Months.map((month, index) => {
                const filter = data.response.data.latestMonthsAttendence.filter((taskTime) => taskTime._id.month === index + 1)
                const totalTasks = Number(filter.length > 0 ? filter[0].total : 0)
                const obj = {
                    month: month.name,
                    shortMonth: month.name.slice(0, 3),
                    totalTasks: Number.isNaN(totalTasks) ? 0 : totalTasks
                }
                return obj
            })
            setMapData(chartMap)
            setLoading(false)
        })
        getAllTraining().then(({ data }) => {
            setLmsData(data.response.filter((lmsData) => {
                if (lmsData.assignedTo.includes(ParentState.auth._id)) {
                    return true
                }
                return false
            }));
        }).catch((err) => console.log(err))
    }

    const pieChartData = [
        { name: 'Total Attendance', value: EmployeeData?.totalAttendance },
        { name: 'Total Leaves', value: EmployeeData?.totalLeaves },
        { name: 'Yet To Mark', value: EmployeeData?.yetToMark },
    ];

    const routeTask = (id, section, projectId) => { router.push({ pathname: `/admin/dashboard/projects/${projectId}`, query: { taskpopup: id, group: section } }); }

    const handleTogglePauseClick = ({ projectId, _id, status, markAsComplete, section }) => {
        if (markAsComplete) {
            routeTask(_id, section, projectId)
            toast('Update Status Here')
            // let body = { id: _id, status: 'Review' };
            // let params = { project: projectId };
            // editSingleTasksController(body, params).then((res) => { toast.success(`Marked as Review`); fetchInitialData() }).catch((res) => { toast.error('Failed to update'); console.log(res); })
        } else {
            let body = { id: _id, status: (status.toLocaleLowerCase() == "paused" || status.toLocaleLowerCase() == "queued") ? "In Progress" : "Paused" };
            let params = { project: projectId };
            editSingleTasksController(body, params).then((res) => { toast.success(`Updated status : ${status.toLocaleLowerCase() == "paused" ? "In Progress" : "Paused"}`); fetchInitialData() }).catch((res) => { toast.error('Failed to update'); console.log(res); })
        }
    }

    if (Loading) return <Loader />

    else return (
        <div className={styles.emp_analytics} style={fromProfile && { paddingTop: "15px" }} >
            <div className={styles.emp_top} >
                {ParentState && <h2>Welcome {ParentState.auth.firstName}</h2>}
            </div>
            <div className={styles.emp_det_graph_main} >
                <h3>Project Analytics</h3>
                <div className={styles.emp_det_graph}>
                    <div className={styles.emp_det_graph_left}>
                        <div className={styles.emp_det_box}>
                            <h5>Completed Task</h5>
                            <div>
                                <h3>{EmployeeData.completedTasks}</h3>
                            </div>
                            <h5>Employee</h5>
                        </div>
                        <div className={styles.emp_det_box}>
                            <h5>In Progress Tasks</h5>
                            <div>
                                <h3>{EmployeeData.inProgressTasks}</h3>
                            </div>
                            <h5>Employee</h5>
                        </div>
                        <div className={styles.emp_det_box}>
                            <h5>Total Projects</h5>
                            <div>
                                <h3>{EmployeeData.totalProjects}</h3>
                            </div>
                            <h5>Employee</h5>
                        </div>
                        <div className={styles.emp_det_box}>
                            <h5>Total Tasks</h5>
                            <div>
                                <h3>{EmployeeData.totalTasks}</h3>
                            </div>
                            <h5>Employee</h5>
                        </div>
                    </div>
                    <div className={styles.emp_det_graph_right}>
                        <div className={styles.emp_graph_top} >
                            <h5>Job Statistics</h5>
                        </div>
                        <div className={styles.emp_graph_bottom} >
                            <ResponsiveContainer>
                                <BarChart
                                    width={400}
                                    height={300}
                                    data={MapData}
                                    margin={{ top: 12, right: 20, left: 0, bottom: 4 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ececf5" />
                                    <XAxis
                                        dataKey="shortMonth"
                                        axisLine={false}
                                        tickLine={false}
                                        interval={0}
                                        tick={{ fontSize: 12, fill: '#6c6c7a' }}
                                    />
                                    <YAxis
                                        allowDecimals={false}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#6c6c7a' }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(136,132,216,0.1)' }}
                                        labelFormatter={(_, payload) => payload?.[0]?.payload?.month || ''}
                                        formatter={(value) => [`${value} tasks`, 'Total']}
                                    />
                                    <Bar dataKey="totalTasks" fill="#7a74e8" radius={[6, 6, 0, 0]} maxBarSize={28} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.emp_status_format} >
                <div className={styles.left}>
                    <div className={styles.left_top}>
                        <h3>Latest Tasks</h3>
                    </div>
                    <div className={styles.emp_status_table_main} >
                        <table className={styles.emp_status_table} >
                            <tr>
                                <th>Project</th>
                                <th>Task Name</th>
                                <th>Started On</th>
                                <th>Due Date</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>View</th>
                            </tr>
                            {EmployeeData?.latestTasks?.map((i, idx) => {
                                const due_date = DateToMonthYear(i.dueDate)
                                const started_on = DateToMonthYear(i.createdAt)
                             return (
                                    <tr key={idx} >
                                        <td>
                                            <div>
                                                <h4>{i.projectName}</h4>
                                            </div>
                                        </td>
                                        <td onClick={(e) => {
                                            e.stopPropagation()
                                            routeTask(i._id, i.section, i.projectId)
                                        }} style={{ cursor: 'pointer' }}>{i.name}</td>
                                        <td>{started_on}</td>
                                        <td>{due_date}</td>
                                        <td>
                                            {i.priority === "Relaxed" && <div className="relaxed" >{i.priority}</div>}
                                            {i.priority === "Critical" && <div className="critical" >{i.priority}</div>}
                                            {i.priority === "High" && <div className="high" >{i.priority}</div>}
                                            {i.priority === "Medium" && <div className="medium" >{i.priority}</div>}
                                        </td>
                                        <td><div>{i.status}</div></td>
                                        <td>
                                            {/* <IconButton onClick={() => {
                                                routeTask(i._id, i.section, i.projectId)
                                            }}>
                                                <ShareOutlined />
                                            </IconButton> */}
                                            <div>
                                                {['In Progress', 'Paused', 'queued'].includes(i.status) && <IconButton onClick={() => handleTogglePauseClick(i)}>
                                                    {
                                                        (i.status.toLocaleLowerCase() == 'paused' || i.status.toLocaleLowerCase() == 'queued') && <PlayCircleOutlineOutlined />
                                                    }
                                                    {
                                                        i.status.toLocaleLowerCase() == 'in progress' && <PauseCircleOutlineOutlined />
                                                    }
                                                </IconButton>}

                                                {i.status != 'queued' && i.status != 'Review' && <IconButton onClick={() => {
                                                    i.markAsComplete = true
                                                    handleTogglePauseClick(i)
                                                }}>
                                                    <CheckCircleOutline />
                                                </IconButton>}
                                                {i.status == 'Review' && <IconButton onClick={() => {
                                                    i.markAsComplete = true
                                                    handleTogglePauseClick(i)
                                                }}>
                                                    <WorkHistoryOutlined />
                                                </IconButton>}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </table>
                    </div>
                    {/* <div className={styles.mid_box_table_bottom} >
                        <h4>Showing latest tasks</h4>
                    </div> */}
                </div>

                <div className={styles.right}>
                    <div className={styles.right_top}>
                        <h3>Attendance Overview</h3>
                    </div>
                    <div className={styles.right_bottom}  >
                        <PieChart width={300} height={300} >
                            <Pie data={pieChartData} cx={150} cy={150} innerRadius={80} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="value">
                                {pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <text x={160} y={150} textAnchor="middle" fontSize={18} >Total</text>
                            <text x={160} y={175} textAnchor="middle" fontSize={20} style={{ fontWeight: "bolder" }} >{EmployeeData.daysInMonth} days</text>
                        </PieChart>
                        <div className={styles.working_format}>
                            <div>
                                <FiberManualRecord style={{ fill: COLORS[0] }} />
                                <h6>Total Attendance({EmployeeData?.totalAttendance})</h6>
                            </div>
                            <div>
                                <FiberManualRecord style={{ fill: COLORS[1] }} />
                                <h6>Total Leaves({EmployeeData?.totalLeaves})</h6>
                            </div>
                            <div>
                                <FiberManualRecord style={{ fill: COLORS[2] }} />
                                <h6>Yet To Mark({EmployeeData?.yetToMark})</h6>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className={styles.right} style={{ width: "32%" }} >
                    <h3>Latest Activities</h3>

                    <div className={styles.activity_section_byday} >
                        <div className={style.activities} >

                            <div className={style.activity_box_main} >
                                <div className={style.activity_box} >
                                    <div className={style.profile_details} >
                                        <ProfileImage size={43} />
                                        <div>
                                            <h4>Steffen Larsson</h4>
                                            <p>2023-08-07</p>
                                        </div>
                                    </div>
                                    <div className={style.activity_text} >
                                        <p>New Employee Added</p>
                                    </div>
                                </div>
                                <div className={style.activity_divider} ></div>
                            </div>

                        </div>

                        <span style={{ position: "absolute", bottom: "10px", cursor: "pointer" }} >See More</span>
                    </div>

                </div> */}


            </div>

            <h2 className='mt_5' >LMS Analytics</h2>

            <div className={styles.bottom_cards_main} >
                <div className={styl.fin_card} style={{ width: "25%" }} >
                    <div className={styl.fin_card_top}>
                        <CreditCardOutlined style={{ fontSize: "27px" }} />
                    </div>
                    <div className={styl.fin_card_mid} >
                        <h2>{lmsData.length}</h2>
                    </div>
                    <div className={styl.fin_card_bottom} >
                        <p>Total traings</p>
                    </div>
                </div>
                <div className={styl.fin_card} style={{ width: "25%" }} >
                    <div className={styl.fin_card_top}>
                        <MonetizationOnOutlined style={{ fontSize: "27px" }} />
                    </div>
                    <div className={styl.fin_card_mid} >
                        <h2>{lmsData.filter((lmsData) => lmsData.completed).length}</h2>
                    </div>
                    <div className={styl.fin_card_bottom} >
                        <p>Completed traings</p>
                    </div>
                </div>
                <div className={styl.fin_card} style={{ width: "25%" }} >
                    <div className={styl.fin_card_top}>
                        <BadgeOutlined style={{ fontSize: "27px" }} />
                    </div>
                    <div className={styl.fin_card_mid} >
                        <h2>{lmsData.filter((lmsData) => (lmsData.active && !lmsData.completed)).length}</h2>
                    </div>
                    <div className={styl.fin_card_bottom} >
                        <p>Active traings</p>
                    </div>
                </div>
                {/* <div className={styl.fin_card} style={{ width: "25%" }} >
                    <div className={styl.fin_card_top}>
                        <AccountBalanceOutlined style={{ fontSize: "27px" }} />
                    </div>
                    <div className={styl.fin_card_mid} >
                        <h2>200</h2>
                    </div>
                    <div className={styl.fin_card_bottom} >
                        <p>Total Jobs</p>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default EmpAnalytics